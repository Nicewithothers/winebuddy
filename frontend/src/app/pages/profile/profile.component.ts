import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FileService } from '../../shared/services/file.service';
import { User } from '../../shared/models/User';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
    selector: 'app-profile',
    imports: [AsyncPipe, HlmCardImports, HlmAvatarImports, HlmButtonImports],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
    user!: User;
    selectedPreviewImage: string | null = null;
    selectedImage: File | null = null;

    constructor(
        protected authService: AuthService,
        private fileService: FileService,
    ) {}

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
    }

    protected openImageDialog(): void {
        const fileInput = document.querySelector('#picture') as HTMLElement;
        fileInput.click();
    }

    onImageSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            this.selectedImage = file;
            reader.onload = e => {
                this.selectedPreviewImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    uploadProfile() {
        if (this.selectedImage) {
            this.fileService
                .uploadProfile(this.user.username, this.selectedImage)
                .subscribe(user => {
                    if (user) {
                        this.user = user;
                        toast.success('Picture updated successfully', {
                            position: 'top-right',
                        });
                    }
                });
        }
    }
}
