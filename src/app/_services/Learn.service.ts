import { Injectable } from '@angular/core';
import { ApiService } from 'sb-shared-lib';
import { User } from '../_types/equal';
import { Course, UserStatement, UserStatus } from '../_types/learn';

@Injectable({
    providedIn: 'root',
})
export class LearnService {
    public user: User;
    public userInfo: Record<string, any>;
    public userAccess: Record<string, any>;
    public userStatus: UserStatus[];

    public courseId: string;
    public course: Course;

    constructor(private api: ApiService) {
        this.getUserInfo();
    }

    public setCourseId(courseId: string): this {
        this.courseId = courseId;

        return this;
    }

    public async getUserInfo(): Promise<void> {
        try {
            this.userInfo = await this.api.get('userinfo');

            this.user = (
                await this.api.collect(
                    'core\\User',
                    [['id', '=', this.userInfo.id]],
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

    public async getUserStatement(): Promise<UserStatement> {
        if (!this.courseId) throw new Error('Course ID not set');
        try {
            const userAccess = (
                await this.api.collect(
                    'learn\\UserAccess',
                    [
                        ['user_id', '=', this.userInfo.id],
                        ['course_id', '=', this.courseId],
                    ],
                    ['course_id', 'module_id', 'user_id', 'chapter_index', 'page_index', 'page_count', 'is_complete'],
                    'module_id'
                )
            )[0];

            const userStatus: UserStatus[] = await this.api.collect(
                'learn\\UserStatus',
                [
                    ['user_id', '=', this.userInfo.id],
                    ['course_id', '=', this.courseId],
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
                ],
                'module_id',
                'desc'
            );

            this.userAccess = userAccess;
            this.userStatus = userStatus;
        } catch (error) {
            console.error(error);
        }
        return {
            user: this.user,
            userInfo: this.userInfo,
            userAccess: this.userAccess,
            userStatus: this.userStatus,
        } as UserStatement;
    }

    public async getCourse(): Promise<Course> {
        if (!this.courseId) throw new Error('Course ID not set');
        try {
            this.course = await this.api.get('?get=learn_course', { course_id: this.courseId });
        } catch (error) {
            console.error(error);
        }

        return this.course;
    }

    public async getCourseIdFromSlug(courseTitleSlug: string): Promise<string | null> {
        courseTitleSlug = courseTitleSlug.replace(/-/g, ' ');

        try {
            return (
                await this.api.collect('learn\\Course', [['title', '=', courseTitleSlug]], ['id'])
            )[0].id.toString();
        } catch (error) {
            console.error(error);
        }

        return null;
    }

    public async loadCourseModule(moduleId: number): Promise<Course> {
        try {
            const module = await this.api.get('?get=learn_module', { id: moduleId });

            const courseModuleIndex = this.course.modules.findIndex(courseModule => courseModule.id === module.id);

            this.course.modules[courseModuleIndex] = module;
        } catch (error) {
            console.error(error);
        }
        return this.course;
    }
}
