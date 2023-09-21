import { Component, OnInit, ViewChild, AfterViewInit,ElementRef, Output, EventEmitter } from '@angular/core';
import { UserSearchService } from './user-search.service';
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit, AfterViewInit {
  @Output() closeClicked = new EventEmitter<void>();
  value = '';
  filteredUsers: string[] = [];
  selectedUsers: string[]= [];
  @ViewChild('inputRef') inputRef!: ElementRef;
  constructor(private userSearchService: UserSearchService) { }

  ngOnInit(): void {
    // Initially, you might want to show all users or none at all
    this.filteredUsers = this.userSearchService.search('');
    
  }
  ngAfterViewInit(): void {
    this.inputRef.nativeElement.focus();
  }
  onSearch(event: any) {
    const query = event.target.value;
    this.filteredUsers = this.userSearchService.search(query);
  }

  selectUser(user: string): void {
    const index = this.selectedUsers.indexOf(user);
    if (index === -1) {
      // User is not in selectedUsers, so add them
      this.selectedUsers.push(user);
    } else {
      // User is already in selectedUsers, so remove them
      this.selectedUsers.splice(index, 1);
    }
    this.inputRef.nativeElement.focus();  // Focus back to the input
  }

  removeUser(index: number): void {
    this.selectedUsers.splice(index, 1);
    this.inputRef.nativeElement.focus();  // Focus back to the input
  }

  onSubmitit(event: Event) {
     
    event.preventDefault(); 
    if (this.value) {
        this.userSearchService.sendInvite(this.value,this.selectedUsers);
        this.value = '';
    }
    else {
         this.userSearchService.sendInvite('Hey come join my node!',this.selectedUsers);
    }
   
  }
}
