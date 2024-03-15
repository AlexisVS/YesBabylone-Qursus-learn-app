import { Component, Input, OnInit } from '@angular/core';
import { Chapter, Course, Module } from '../../_types/learn';
import { UserStatement } from '../../in/large/large.component';

type TotalCourseProgress = {
    current: string;
    total: string;
    currentPourcentage: string;
};

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
    @Input() public environmentInfo: Record<string, any>;
    @Input() public appInfo: Record<string, any>;
    @Input() public userStatement: UserStatement;
    @Input() public course: Course;

    public currentModule?: Module;
    public currentLesson?: Chapter;

    public currentModuleProgress: string;
    public currentLessonProgress: string;
    public currentTotalCourseProgress: TotalCourseProgress = {} as TotalCourseProgress;

    ngOnInit(): void {
        this.currentModule = this.getCurrentModule();
        this.currentLesson = this.getCurrentLesson();

        if (this.currentModule) {
            this.computeCurrentModuleProgress();
            this.computeCurrentLessonProgress();
        }

        this.computeProgressTotalStats();
    }

    public getCurrentModule(): Module | undefined {
        if (!this.course.modules || this.course.modules.length === 0) return undefined;

        if (this.userStatement.userStatus.length > 0) {
            const currentModuleId: number | undefined = this.userStatement.userStatus.sort(
                (a, b) => b.module_id - a.module_id
            )[0].module_id;

            return <Module>this.course.modules.find(module => module.id === currentModuleId);
        } else {
            const sortedModules = this.course.modules.sort((a, b) => a.order! - b.order!);

            if (sortedModules && sortedModules.length > 0) {
                return sortedModules.find(module => module.chapters && module.chapters.length > 0);
            }
        }

        return undefined;
    }

    public getCurrentLesson(): Chapter | undefined {
        const currentModule = this.getCurrentModule();
        const currentChapters: Record<string, any>[] = this.userStatement.userStatus.sort(
            (a: Record<string, any>, b: Record<string, any>) => b.chapter_index - a.chapter_index
        );

        if (!currentModule || !currentModule.chapters || currentModule.chapters.length === 0) return undefined;

        const sortedCurrentModuleChapters = currentModule.chapters.sort((a, b) => a.order! - b.order!);

        if (currentChapters.length === 0) {
            return sortedCurrentModuleChapters[0];
        }

        if (currentChapters[0] && currentChapters[0].hasOwnProperty('chapter_index')) {
            const currentChapterIndex: number = currentChapters[0].chapter_index;

            return sortedCurrentModuleChapters[currentChapterIndex];
        }

        return sortedCurrentModuleChapters[0];
    }

    public computeCurrentModuleProgress(): void {
        if (!this.currentModule) return;

        this.currentModuleProgress = `${this.userStatement.userStatus.length === 0 ? 1 : this.userStatement.userStatus.length} / ${this.course.modules?.length} -
                        ${this.computeDuration(this.currentModule.duration)}`;
    }

    public computeCurrentLessonProgress(): void {
        const userStatus: Record<string, any> = this.userStatement.userStatus.find(
            userStatus => userStatus.module_id === this.currentModule?.id
        );

        let currentChapterIndex: number = 0;

        if (userStatus.hasOwnProperty('chapter_index')) {
            currentChapterIndex = userStatus.chapter_index as number;
        }

        if (this.currentLesson && this.currentModule) {
            this.currentLessonProgress = `${currentChapterIndex} / ${this.currentModule.chapter_count} - ${this.computeDuration(this.currentLesson.duration)} - ${this.currentLesson.pages?.length + 'p'}`;
        }
    }

    public computeProgressTotalStats(): void {
        // current
        const lastChapterOrder: number = this.currentLesson!.order!;
        const activeModuleLessonsDurations: number = this.currentModule!.chapters?.filter(
            chapter => chapter.order! <= lastChapterOrder
        )?.reduce((acc, chapter) => acc + chapter.duration, 0)!;

        const activeModuleOrder: number = this.currentModule!.order!;
        const previousCourseModulesDurations: number = this.course.modules
            ?.filter(module => module.order! < activeModuleOrder)
            ?.reduce((acc, module) => acc + module.duration, 0)!;

        const currentTotalProgression: number = activeModuleLessonsDurations + previousCourseModulesDurations;

        // total
        const totalCourseDuration: number = this.course.modules?.reduce((acc, module) => acc + module.duration, 0)!;

        // currentPercentage
        const currentPourcentage: number = (currentTotalProgression / totalCourseDuration) * 100;

        this.currentTotalCourseProgress = {
            current: this.computeDuration(currentTotalProgression),
            total: this.computeDuration(totalCourseDuration),
            currentPourcentage: `${currentPourcentage.toFixed()}`,
        };
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
