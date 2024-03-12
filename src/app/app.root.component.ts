import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// @ts-ignore
import { AuthService, ApiService } from 'sb-shared-lib';
import { User } from './_types/equal';

@Component({
    selector: 'app-root',
    templateUrl: './app.root.component.html',
    styleUrls: ['./app.root.component.scss'],
})
// , OnDestroy
export class AppRootComponent implements OnInit, AfterViewInit {
    public user: User;
    public userAccess: any;
    public userInfo: any;
    public userStatus: any;
    public environnementInfo: any;

    constructor(
        private router: Router,
        // private context: ContextService,
        private api: ApiService,
        private auth: AuthService
        // private env: EnvService,
    ) {}

    public async ngOnInit(): Promise<void> {
        try {
            this.userInfo = await this.api.get('userinfo');
            this.userAccess = await this.api.collect(
                'learn\\UserStatus',
                [['user_id', '=', this.userInfo.id]],
                ['course_id', 'module_id', 'user_id', 'chapter_index', 'page_index', 'page_count', 'is_complete']
            );

            this.userStatus = await this.api.collect(
                'learn\\UserStatus',
                [['user_id', '=', this.userInfo.id]],
                ['code', 'code_alpha', 'course_id', 'master_user_id', 'user_id', 'is_complete']
            );

            this.user = Array.from(
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

            this.environnementInfo = await this.api.get('appinfo');
        } catch (err) {
            if (!this.user) {
                window.location.href = 'http://equal.local/auth';
            }
            console.error('Error in appRoot: \n', err);
            return;
        }
    }

    public ngAfterViewInit(): void {
        window.innerWidth < 1024
            ? this.router.navigate(['small', '1'], { relativeTo: this.router.routerState.root })
            : this.router.navigate(['large', '1'], { relativeTo: this.router.routerState.root });
    }
}
