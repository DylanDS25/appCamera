import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  photos: { image:string, date:string, caption:string }[] = [];
  photo: string | undefined;
  // isValid = true;

  constructor() {}



  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    // console.log(image);
    // this.photo = image.dataUrl;

    this.photos.push({
      image: image.dataUrl || '',
      date: new Date().toLocaleDateString(),
      caption: ''
    })
  }

}
