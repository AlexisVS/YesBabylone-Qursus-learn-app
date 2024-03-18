import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Course, UserStatement } from '../../_types/learn';
// @ts-ignore
import { ApiService } from 'sb-shared-lib';
import { ActivatedRoute } from '@angular/router';
import { LearnService } from '../../_services/Learn.service';

type DrawerState = 'inactive' | 'active' | 'pinned';

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
        private elementRef: ElementRef,
        private learnService: LearnService
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

    public ngAfterViewInit(): void {
        this.load();
    }

    public async load(): Promise<void> {
        this.environnementInfo = await this.api.get('appinfo');
        this.appInfo = await this.api.get('assets/env/config.json');

        const courseTitleSlug: string | null = this.route.snapshot.paramMap.get('slug');

        if (courseTitleSlug) {
            this.setDocumentTitle(courseTitleSlug);
            const courseId: string | null = await this.learnService.getCourseIdFromSlug(courseTitleSlug);

            if (courseId) {
                this.learnService.setCourseId(courseId);
                this.userStatement = await this.learnService.getUserStatement();

                this.course = await this.learnService.getCourse();
                this.isLoading = false;

                if (this.course) {
                    this.currentModuleProgressionIndex = this.getCurrentModuleIndex();
                    this.hasAccessToCourse = true;
                }
            }
        }
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

    public setDocumentTitle(title: string): void {
        // for reloading purpose
        if (title?.includes('-')) {
            title = title.replace(/-/g, ' ');
        }
        const courseTitleHyphenated: string = title.replace(/ /g, '-');

        document.title = `Learn - ${title}`;
        window.history.replaceState({}, '', `/${courseTitleHyphenated}`);
    }

    public getCurrentModuleIndex(): number {
        if (!this.course.modules || this.course.modules.length === 0) return 0;

        if (this.userStatement.userStatus.length > 0) {
            const currentModuleId: number = this.userStatement.userStatus.sort((a, b) => b.module_id - a.module_id)[0]
                .module_id;

            return this.course.modules.findIndex(module => module.id === currentModuleId);
        }

        return 0;
    }

    public getUserStatusChapterIndex(moduleId: number): number {
        const chapterStatus = this.userStatement.userStatus.find(userStatus => userStatus.module_id === moduleId);

        if (chapterStatus) {
            return chapterStatus.chapter_index;
        } else {
            return 0;
        }
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

    public async onClickChapter(moduleId: number): Promise<void> {
        this.course = await this.learnService.loadCourseModule(moduleId);
    }
}
