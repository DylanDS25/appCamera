import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { ITask } from '../Interfaces/ITask';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // photos: { image:string, date:string, caption:string }[] = [];
  // isValid = true;
  isToastOpen = false;
  photos: ITask[] = [];
  constructor(private _AlertController: AlertController, private _Storage: Storage) { }

  async ngOnInit() {
    await this._Storage.create();

    const photos = await this._Storage.get('photos');

    this.photos = photos ? JSON.parse(photos) : [];

  }

  async takePicture() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    const alert = await this._AlertController.create({
      header: "Descripcion Foto",
      inputs: [{
        type: 'text',
        name: 'title',
        placeholder: 'Descripcion'
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
      }, {
        text: 'Agregar',
        handler: async (data) => {
          if (data.title.trim() === '') {
            this.isToastOpen = true;
            return;
          }
          this.photos.push({
            image: image.dataUrl || '',
            date: new Date().toLocaleDateString(),
            caption: data.title
          });
          await this.savePicture();
        }
      }]
    });

    await alert.present();

    // console.log(image);
    // this.photo = image.dataUrl;

    // this.photos.push({
    //   image: image.dataUrl || '',
    //   date: new Date().toLocaleDateString(),
    //   caption: ''
    // })
  }

  private async savePicture() {
    await this._Storage.set('photos', JSON.stringify(this.photos));
  }

  async updatePicture (photo: ITask){
    const alert = await this._AlertController.create({
      header: "Editar Tarea",
      inputs: [{
        type: 'text',
        name: 'title',
        value: photo.caption,
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
      }, {
        text: 'Actualizar',
        handler: (data) => {
          if (data.title.trim() === '') {
            this.isToastOpen = true;
            return;
          }
          this.photos[this.photos.indexOf(photo)].caption = data.title;
          this.savePicture();
        }
      }]
    });
    await alert.present();
  }
}
