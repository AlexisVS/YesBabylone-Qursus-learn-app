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

    public onClickOutsideDrawer(event: Event): void {
        if (this.drawerState === 'active') {
            this.drawerState = 'inactive';
            this.menuIcon = 'menu';
        }
    }
}
