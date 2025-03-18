import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent implements OnInit {
  @Input() totalItems!: number;  // Total items available
  @Input() pageSize!: number;  // Items per page
  @Output() pageChanged = new EventEmitter<number>();

  currentPage: number = 1;  // Start at page 1

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  ngOnInit(): void {
    this.pageChanged.emit(this.currentPage);
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.totalPages;
  }

  nextPage() {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.pageChanged.emit(this.currentPage);
    }
  }

  prevPage() {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.pageChanged.emit(this.currentPage);
    }
  }
}
