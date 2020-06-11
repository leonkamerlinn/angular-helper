import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from "./firestore-service.service";


export const FirestoreServiceConfig = new InjectionToken<any>('FirestoreServiceConfig');

@NgModule({
    declarations: [],
    providers: [FirestoreService],
    imports: [
        CommonModule
    ]
})
export class FirestoreServiceModule {
    constructor(@Optional() @SkipSelf() parentModule?: FirestoreServiceModule) {
        if (parentModule) {
            throw new Error(
                'FirestoreServiceModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: any): ModuleWithProviders {
        return {
            ngModule: FirestoreServiceModule,
            providers: [
                { provide: FirestoreServiceConfig, useValue: config }
            ]
        };
    }
}
