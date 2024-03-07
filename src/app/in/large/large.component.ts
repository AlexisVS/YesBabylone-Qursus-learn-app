import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';

type DrawerState = 'inactive' | 'active' | 'pinned';

@Component({
    selector: 'app-large',
    templateUrl: './large.component.html',
    styleUrls: ['./large.component.scss'],
})
export class LargeComponent {
    @ViewChild('drawer', { static: true }) drawer: ElementRef<HTMLDivElement>;
    @ViewChild('sideBarMenuButton') sideBarMenuButton: MatButton;

    public drawerState: DrawerState = 'inactive';
    public menuIcon: string = 'menu';
    public selectedModuleIndex: number = 0;

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
    ];

    constructor(private elementRef: ElementRef) {
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
                this.menuIcon = 'anchor';
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

    public onClickOutsideDrawer(event: Event): void {
        if (this.drawerState === 'active') {
            this.drawerState = 'inactive';
            this.menuIcon = 'menu';
        }
    }
}
