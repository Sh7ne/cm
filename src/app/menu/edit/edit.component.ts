import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { now, includes } from 'lodash'
import { Menu } from 'src/app/api/menu';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from 'src/app/api/context.service';

@Component({
  selector: 'cm-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  title = 'Create'
  menu: Menu = {
    name: '',
    code: `${now()}`,
    contexts: ['page'],
    tags: ['Custom'],
    url: '',
    language: 'all',
    select: true,
  }
  data: any
  constructor(
    private modal: ModalController,
    private translate: TranslateService,
    private actionSheet: ActionSheetController,
    public contextService: ContextService,
  ) { }

  cancel() {
    this.modal.dismiss()
  }

  get isURL() {
    return includes(this.menu.url, '/')
  }

  async save() {
    const name = await this.translate.get(this.menu.code).toPromise()
    if (name == this.menu.name) {
      this.menu.name = ''
    }
    Object.assign(this.data, this.menu)
    this.modal.dismiss(this.menu, this.title)
  }

  ngOnInit() {
    if (this.data) {
      this.title = 'Edit'
      this.menu = Object.assign({}, this.data)
      if (!this.menu.name) {
        this.translate.get(this.menu.code)
          .subscribe(n => this.menu.name = n)
      }
    } else {
      this.data = {}
    }
  }

  async remove() {
    const del = await this.translate.get('Delete').toPromise()
    const can = await this.translate.get('Cancel').toPromise()
    const pro = await this.translate.get('Prompt').toPromise()
    const actionSheet = await this.actionSheet.create({
      header: pro,
      buttons: [{
        text: del,
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.modal.dismiss(this.menu, 'Remove')
        }
      }, {
        text: can,
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }
}
