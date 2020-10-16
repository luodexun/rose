import { Directive ,HostBinding,HostListener} from '@angular/core';

@Directive({
  selector: '[appPlayer]'
})
export class PlayerDirective {
  possibleColors = [
    'darksalmon', 'hotpink', 'lightskyblue', 'goldenrod', 'peachpuff',
    'mediumspringgreen', 'cornflowerblue', 'blanchedalmond', 'lightslategrey'
  ];
  @HostBinding('style.color') color: string;
  @HostBinding('style.borderColor') borderColor: string;
  @HostListener('keydown') onKeydown(){
    const colorPick = Math.floor(Math.random() * this.possibleColors.length);
    this.color = this.borderColor = this.possibleColors[colorPick];
  }

}
