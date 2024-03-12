import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// @ts-ignore
import { AuthService, ApiService } from 'sb-shared-lib';



@Component({
    selector: 'app-root',
    templateUrl: './app.root.component.html',
    styleUrls: ['./app.root.component.scss'],
})
// , OnDestroy
export class AppRootComponent implements OnInit, AfterViewInit {
    public userInfo: any;


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
        } catch (err) {
            if (!this.userInfo) {
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
