import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Course } from '../../_types/learn';
// @ts-ignore
import { ApiService } from 'sb-shared-lib';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_types/equal';

type DrawerState = 'inactive' | 'active' | 'pinned';

export type UserStatement = {
    user: User;
    userAccess: any;
    userInfo: any;
    userStatus: any[];
};

@Component({
    selector: 'app-large',
    templateUrl: './large.component.html',
    styleUrls: ['./large.component.scss'],
})
export class LargeComponent implements AfterViewInit {
    @ViewChild('drawer', { static: true }) drawer: ElementRef<HTMLDivElement>;
    @ViewChild('sideBarMenuButton') sideBarMenuButton: MatButton;

    public userStatement: UserStatement = {} as UserStatement;

    public environnementInfo: Record<string, any>;
    public appInfo: Record<string, any>;

    public drawerState: DrawerState = 'inactive';
    public menuIcon: string = 'menu';
    public currentModuleProgressionIndex: number = 0;
    public selectedModuleIndex: number = 0;

    public course: Course;
    public hasAccessToCourse: boolean = false;
    public isLoading: boolean = true;

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private elementRef: ElementRef
    ) {
        window.addEventListener('click', (event: MouseEvent): void => {
            if (
                this.drawerState === 'active' &&
                !this.sideBarMenuButton._elementRef.nativeElement.contains(event.target as Node)
            ) {
                if (!this.drawer.nativeElement.contains(event.target as Node)) {
                    this.drawerState = 'inactive';
                    this.menuIcon = 'menu';
                }
            }
        });
    }

    public onSideBarButtonClick(): void {
        switch (this.drawerState) {
            case 'inactive':
                this.drawerState = 'active';
                this.menuIcon = 'push_pin';
                break;
            case 'active':
                this.drawerState = 'pinned';
                this.menuIcon = 'close';
                break;
            case 'pinned':
                this.drawerState = 'inactive';
                this.menuIcon = 'menu';
                break;
        }
    }

    public onStarredLessonClick(event: MouseEvent, lesson: any, module: any): void {
        if (lesson.hasOwnProperty('starred')) {
            lesson.starred = !lesson.starred;
        } else {
            lesson.starred = true;
        }
    }

    // public ngOnInit(): void {
    // }

    public ngAfterViewInit(): void {
        this.load();
    }

    public async load(): Promise<void> {
        this.environnementInfo = await this.api.get('appinfo');

        this.appInfo = await this.api.get('assets/env/config.json');

        const courseTitleSlug: string | null = this.route.snapshot.paramMap.get('slug');
        const courseId: string = (
            await this.api.collect('learn\\Course', [['title', '=', courseTitleSlug]], ['id'])
        )[0].id.toString();

        if (courseId && courseTitleSlug) {
            const courseTitleHyphenated: string = courseTitleSlug.replace(/ /g, '-');

            document.title = `Learn - ${courseTitleSlug}`;
            window.history.replaceState({}, '', `/${courseTitleHyphenated}`);

            await this.loadUserStatement(courseId);
            await this.loadCourse(courseId);

            if (this.course) {
                this.currentModuleProgressionIndex = this.getCurrentModuleIndex();
                this.hasAccessToCourse = true;
            }
        }
        this.isLoading = false;
    }

    public async loadUserStatement(courseId: string): Promise<void> {
        try {
            this.userStatement.userInfo = await this.api.get('userinfo');

            this.userStatement.userAccess = await this.api.collect(
                'learn\\UserAccess',
                [
                    ['user_id', '=', this.userStatement.userInfo.id],
                    ['course_id', '=', courseId],
                ],
                ['course_id', 'module_id', 'user_id', 'chapter_index', 'page_index', 'page_count', 'is_complete']
            );

            this.userStatement.userStatus = await this.api.collect(
                'learn\\UserStatus',
                [
                    ['user_id', '=', this.userStatement.userInfo.id],
                    ['course_id', '=', courseId],
                ],
                [
                    'code',
                    'code_alpha',
                    'course_id',
                    'master_user_id',
                    'user_id',
                    'is_complete',
                    'module_id',
                    'chapter_index',
                ]
            );

            this.userStatement.user = Array.from(
                await this.api.collect(
                    'core\\User',
                    [['id', '=', this.userStatement.userInfo.id]],
                    [
                        'name',
                        'organisation_id',
                        'validated',
                        'lastname',
                        'login',
                        'language',
                        'identity_id',
                        'firstname',
                        'status',
                        'username',
                    ]
                )
            )[0] as User;
        } catch (error) {
            console.error(error);
        }
    }

    public getUserStatusChapterIndex(moduleId: number): number {
        const chapterStatus: Record<string, any> | undefined = this.userStatement.userStatus.find(
            (status: Record<string, any>): boolean => status.module_id === moduleId
        );

        if (!chapterStatus || !chapterStatus.hasOwnProperty('chapter_index')) {
            return 0;
        } else {
            return chapterStatus.chapter_index;
        }
    }

    public async loadCourse(courseId: string): Promise<void> {
        try {
            this.course = await this.api.get('?get=learn_course', { course_id: courseId });
            this.isLoading = false;
        } catch (error) {
            console.error(error);
        }
    }

    public getCurrentModuleIndex(): number {
        if (!this.course.modules || this.course.modules.length === 0) return 0;

        if (this.userStatement.userStatus.length > 0) {
            const currentModuleId: number | undefined = this.userStatement.userStatus.sort(
                (a, b) => b.module_id - a.module_id
            )[0].module_id;

            if (currentModuleId) {
                return this.course.modules.findIndex(module => module.id === currentModuleId);
            }
        }

        return 0;
    }

    public computeDuration(duration: number): string {
        const hours: number = Math.floor(duration / 60);
        const minutes: number = duration % 60;

        if (hours === 0) {
            return `${minutes}min`;
        } else {
            return `${hours}h ${minutes}min`;
        }
    }
}
