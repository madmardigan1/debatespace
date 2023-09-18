import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CardDataService, Card } from '../space-service.service';
import { Router } from '@angular/router';
import { DebateAuthService } from '../home/debate-auth.service';

@Component({
  selector: 'app-spacecreate',
  templateUrl: './spacecreate.component.html',
  styleUrls: ['./spacecreate.component.css']
})
export class SpacecreateComponent implements AfterViewInit {
  isToggled: boolean = false;
  additionalOptionValue: boolean = false;
  form: FormGroup;
  cards: Card[] = [];
  isRanked = false;
  @ViewChild('topicInput') topicInput!: ElementRef;
  constructor(private fb: FormBuilder, private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService) {
   // Inside your component class constructor:
this.form = this.fb.group({
  topic: ['', Validators.required],
  description: ['', Validators.required],
  number: ['', Validators.required],
  entrancefee: [],
  isToggled: [false],
  isToggled1: [false],  // new form control for toggle
  additionalOptionValue: [false]  // new form control for checkbox
});


    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
  }
  printToggleValue() {
    console.log(this.isToggled);
 }
  toggleRanked() {
    this.isRanked = !this.isRanked;
}

inviteToggle() {}
onToggleChange() {
  this.isToggled = this.form.get('isToggled')?.value;
}

  ngAfterViewInit() {
    this.topicInput.nativeElement.focus();
  }
  submit() {
    const formData = this.form.value;
    const id = Date.now().toString();
    this.cardService.addCard({ ...formData, id });
    this.debateAuth.setUser('host');
    this.router.navigate(['/debate', id]);
  }
}

