import { Component, EventEmitter, Output } from "@angular/core";
import {
	LoadingController,
	ModalController,
	NavController,
} from "@ionic/angular";
import { AuthService } from "@services/auth/auth.service";
import { ToastService } from "@services/toast/toast.service";

import { PinCodeModal } from "@app/modals/pin-code/pin-code";
import { TranslateService } from "@ngx-translate/core";

import * as _ from "lodash";

@Component({
	selector: "pin-code",
	templateUrl: "pin-code.html",
})
export class PinCodeComponent {
	@Output()
	success: EventEmitter<void> = new EventEmitter();

	@Output()
	wrong: EventEmitter<void> = new EventEmitter();

	@Output()
	close: EventEmitter<void> = new EventEmitter();

	constructor(
		private authProvider: AuthService,
		private toastProvider: ToastService,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private loadingCtrl: LoadingController,
		private translateService: TranslateService,
	) {}

    async open(
        message: string,
        outputPassword: boolean
    ) {
        const modal = await this.modalCtrl.create({
            component: PinCodeModal,
            componentProps: {
                message,
                outputPassword,
                validatePassword: true,
            },
        });

        modal.onDidDismiss().then(async ({ data }) => {
            console.log(data);
            if (_.isNil(data)) {
                return this.close.emit();
            }
            return this.success.emit(data);
        });

        modal.present();
    }
    public async createPinCode(update?:boolean){
        const pinCodeModal = await this.modalCtrl.create({
            component: PinCodeModal,
            componentProps: {
                message: "PIN_CODE.CREATE",
                outputPassword: true,
            },
        });
        pinCodeModal.onDidDismiss().then(async ({ data: password }) => {
            if (password) {
                const validateModal = await this.modalCtrl.create({
                    component: PinCodeModal,
                    componentProps: {
                        message: "PIN_CODE.CONFIRM",
                        expectedPassword: password,
                    },
                });

                validateModal
                    .onDidDismiss()
                    .then(({ data: status }) => {
                        if (status) {
                            this.authProvider.saveMasterPassword(
                                password,
                            );
                            this.toastProvider.success(
                                "PIN_CODE.PIN_CREATED_TEXT",
                            );
                            return this.success.emit();
                        } else {
                            this.toastProvider.error(
                                update
                                    ? "PIN_CODE.PIN_UPDATED_ERROR_TEXT"
                                    : "PIN_CODE.PIN_CREATED_ERROR_TEXT",
                            );
                        }
                    });

                validateModal.present();
            } else {
                this.toastProvider.error(
                    update
                        ? "PIN_CODE.PIN_UPDATED_ERROR_TEXT"
                        : "PIN_CODE.PIN_CREATED_ERROR_TEXT",
                );
            }
        });

        pinCodeModal.present();
    };

	public async updatePinCode() {
        const modal = await this.modalCtrl.create({
            component: PinCodeModal,
            componentProps: {
                message: "PIN_CODE.DEFAULT_MESSAGE",
                outputPassword: false,
                validatePassword: true,
            },
        });
        await modal.present();
        modal.onDidDismiss().then(({ data: status}) => {
            if (status) {
                this.createPinCode(true)
            }
        });
	}
}
