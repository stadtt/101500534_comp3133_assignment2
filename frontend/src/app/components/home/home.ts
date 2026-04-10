import { Component } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'home',
  imports: [Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
