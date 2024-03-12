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
    constructor(
        private router: Router,
        // private context: ContextService,
        private api: ApiService,
        private auth: AuthService
        // private env: EnvService,
    ) {}

    public async ngOnInit(): Promise<void> {
        try {
            const authResponse = await this.api.get('/userinfo');
            console.log('authResponse', authResponse);
        } catch (err) {
            // window.location.href = 'http://equal.local/auth';
            return;
        }
    }

    public ngAfterViewInit(): void {
        window.innerWidth < 1024
            ? this.router.navigate(['small'], { relativeTo: this.router.routerState.root })
            : this.router.navigate(['large'], { relativeTo: this.router.routerState.root });
    }
}
