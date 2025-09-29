import { Component, computed, input, InputSignal, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html'
})
export class Pagination {
  public pages: InputSignal<number> = input(0);
  public currentPage: InputSignal<number> = input<number>(1);

  public activePage: WritableSignal<number> = linkedSignal<number>(this.currentPage);

  public getPagesList: Signal<number[]> = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
