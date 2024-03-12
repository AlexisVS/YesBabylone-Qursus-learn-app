import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chapter, Course, Group, Leaf, Module, Page, Widget } from '../../_types/qursus';
// @ts-ignore
import { ApiService } from 'sb-shared-lib';
import { ActivatedRoute } from '@angular/router';

type DrawerState = 'inactive' | 'active' | 'pinned';

@Component({
    selector: 'app-large',
    templateUrl: './large.component.html',
    styleUrls: ['./large.component.scss'],
})
export class LargeComponent implements OnInit {
    @ViewChild('drawer', { static: true }) drawer: ElementRef<HTMLDivElement>;
    @ViewChild('sideBarMenuButton') sideBarMenuButton: MatButton;

    public drawerState: DrawerState = 'inactive';
    public menuIcon: string = 'menu';
    public selectedModuleIndex: number = 0;

    public course: Course;

    public courseItemLists: {
        title: string;
        lessons: {
            starred?: boolean;
            title: string;
        }[];
    }[] = [
        {
            title: 'Module 1',
            lessons: [
                { title: 'Lesson 1 of Module 1', starred: true },
                { title: 'Lesson 2 of Module 1' },
                { title: 'Lesson 3 of Module 1', starred: true },
                { title: 'Lesson 4 of Module 1' },
                { title: 'Lesson 5 of Module 1' },
                { title: 'Lesson 6 of Module 1' },
                { title: 'Lesson 7 of Module 1' },
                { title: 'Lesson 8 of Module 1' },
                { title: 'Lesson 9 of Module 1' },
                { title: 'Lesson 10 of Module 1' },
                { title: 'Lesson 11 of Module 1' },
                { title: 'Lesson 12 of Module 1' },
                { title: 'Lesson 13 of Module 1' },
                { title: 'Lesson 14 of Module 1' },
                { title: 'Lesson 15 of Module 1' },
                { title: 'Lesson 16 of Module 1' },
                { title: 'Lesson 17 of Module 1' },
                { title: 'Lesson 18 of Module 1' },
                { title: 'Lesson 19 of Module 1' },
                { title: 'Lesson 20 of Module 1' },
                { title: 'Lesson 21 of Module 1' },
            ],
        },
        {
            title: 'Module 2',
            lessons: [
                { title: 'Lesson 1 of Module 2' },
                { title: 'Lesson 2 of Module 2', starred: true },
                { title: 'Lesson 3 of Module 2' },
            ],
        },
        {
            title: 'Module 3',
            lessons: [
                { title: 'Lesson 1 of Module 3' },
                { title: 'Lesson 2 of Module 3', starred: true },
                { title: 'Lesson 3 of Module 3', starred: true },
            ],
        },
        {
            title: 'Module 4',
            lessons: [
                { title: 'Lesson 1 of Module 4', starred: true },
                { title: 'Lesson 2 of Module 4' },
                { title: 'Lesson 3 of Module 4' },
            ],
        },
        {
            title: 'Module 5',
            lessons: [
                { title: 'Lesson 1 of Module 5' },
                { title: 'Lesson 2 of Module 5', starred: true },
                { title: 'Lesson 3 of Module 5' },
            ],
        },
        {
            title: 'Module 6',
            lessons: [
                { title: 'Lesson 1 of Module 6' },
                { title: 'Lesson 2 of Module 6', starred: true },
                { title: 'Lesson 3 of Module 6' },
            ],
        },
        {
            title: 'Module 7',
            lessons: [
                { title: 'Lesson 1 of Module 7' },
                { title: 'Lesson 2 of Module 7', starred: true },
                { title: 'Lesson 3 of Module 7' },
            ],
        },
        {
            title: 'Module 8',
            lessons: [
                { title: 'Lesson 1 of Module 8' },
                { title: 'Lesson 2 of Module 8', starred: true },
                { title: 'Lesson 3 of Module 8' },
            ],
        },
        {
            title: 'Module 9',
            lessons: [
                { title: 'Lesson 1 of Module 9' },
                { title: 'Lesson 2 of Module 9', starred: true },
                { title: 'Lesson 3 of Module 9' },
            ],
        },
        {
            title: 'Module 10',
            lessons: [
                { title: 'Lesson 1 of Module 10' },
                { title: 'Lesson 2 of Module 10', starred: true },
                { title: 'Lesson 3 of Module 10' },
            ],
        },
        {
            title: 'Module 11',
            lessons: [
                { title: 'Lesson 1 of Module 11' },
                { title: 'Lesson 2 of Module 11', starred: true },
                { title: 'Lesson 3 of Module 11' },
            ],
        },
        {
            title: 'Module 12',
            lessons: [
                { title: 'Lesson 1 of Module 12' },
                { title: 'Lesson 2 of Module 12', starred: true },
                { title: 'Lesson 3 of Module 12' },
            ],
        },
    ];

    constructor(
        private elementRef: ElementRef,
        private api: ApiService,
        private route: ActivatedRoute
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

    public ngOnInit(): void {
        this.loadCourse();
    }

    public async loadCourse(): Promise<void> {
        try {
            const courseId: string | null = this.route.snapshot.paramMap.get('courseId');
            if (courseId) {
                this.course = Array.from(
                    await this.api.collect(
                        'learn\\Course',
                        [['id', '=', courseId]],
                        ['name', 'title', 'subtitle', 'description']
                    )
                )[0] as Course;

                this.loadModules();
            }
        } catch (error) {
            console.error(error);
        }

        console.log('THE COURSE', this.course);
    }

    public async loadModules(): Promise<void> {
        try {
            const courseId = this.route.snapshot.paramMap.get('courseId');
            if (courseId) {
                const modules = (await this.api.collect(
                    'learn\\Module',
                    [['course_id', '=', courseId]],
                    [
                        'id',
                        'identifier',
                        'order',
                        'title',
                        'link',
                        'page_count',
                        'chapter_count',
                        'description',
                        'duration',
                        'course_id',
                    ]
                )) as Module[];

                if (modules && modules.length > 0) {
                    modules.sort((a, b) => a.order! - b.order!);
                    this.course.modules = modules;
                    this.loadChapter();
                }

                console.log(modules, this.course);
            }
        } catch (error) {
            console.error(error);
        }
    }

    private async loadChapter(): Promise<void> {
        if (this.course.modules && this.course.modules?.length > 0) {
            for (const module of this.course.modules) {
                try {
                    let lessons: Chapter[] = (await this.api.collect(
                        'learn\\Chapter',
                        [['module_id', '=', module.id]],
                        ['id', 'identifier', 'order', 'title', 'description', 'module_id', 'page_count']
                    )) as Chapter[];

                    lessons.sort((a, b) => a.order! - b.order!);

                    lessons = await this.loadPages(lessons);

                    module.lessons = lessons;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    private async loadPages(lessons: Chapter[]): Promise<Chapter[]> {
        for (const lesson of lessons) {
            try {
                let pages: Page[] = await this.api.collect(
                    'learn\\Page',
                    [['chapter_id', '=', lesson.id]],
                    ['id', 'identifier', 'order', 'next_active', 'next_active_rule', 'chapter_id']
                );

                pages.sort((a, b) => a.order! - b.order!);

                pages = await this.loadLeaves(pages);

                lesson.pages = pages;
            } catch (error) {
                console.error(error);
            }
        }

        return lessons;
    }

    public async loadLeaves(pages: Page[]): Promise<Page[]> {
        for (const page of pages) {
            try {
                let leaves: Leaf[] = await this.api.collect(
                    'learn\\Leaf',
                    [['page_id', '=', page.id]],
                    ['id', 'identifier', 'order', 'background_image', 'page_id']
                );

                // @ts-ignore
                leaves.sort((a, b) => a.order! - b.order!);

                leaves = await this.loadGroups(leaves);

                page.leaves = leaves;
            } catch (error) {
                console.error(error);
            }
        }

        return pages;
    }

    public async loadGroups(leaves: Leaf[]): Promise<Leaf[]> {
        for (const leaf of leaves) {
            try {
                let groups: Group[] = await this.api.collect(
                    'learn\\Group',
                    [['leaf_id', '=', leaf.id]],
                    [
                        'id',
                        'identifier',
                        'order',
                        'direction',
                        'row_span',
                        'visible',
                        'visibility_rule',
                        'fixed',
                        'leaf_id',
                    ]
                );

                // @ts-ignore
                groups.sort((a, b) => a.order! - b.order!);

                groups = await this.loadWidgets(groups);

                leaf.groups = groups;
            } catch (error) {
                console.error(error);
            }
        }

        return leaves;
    }

    private async loadWidgets(groups: Group[]): Promise<Group[]> {
        for (const group of groups) {
            try {
                let widgets: Widget[] = await this.api.collect(
                    'learn\\Widget',
                    [['group_id', '=', group.id]],
                    [
                        'id',
                        'identifier',
                        'order',
                        'content',
                        'type',
                        'section_id',
                        'image_url',
                        'video_url',
                        'sound_url',
                        'has_separator_left',
                        'has_separator_right',
                        'align',
                        'on_click',
                    ]
                );

                // @ts-ignore
                widgets.sort((a, b) => a.order! - b.order!);

                group.widgets = widgets;
            } catch (error) {
                console.error(error);
            }
        }

        return groups;
    }
}
