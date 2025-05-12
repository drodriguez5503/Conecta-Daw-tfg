import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-folder-panel',
  standalone: true,
  imports: [],
  templateUrl: './folder-panel.component.html',
  styleUrl: './folder-panel.component.scss'
})
export class FolderPanelComponent {
  private resizing = false;

  constructor(private renderer: Renderer2) {}

  startResizing(event: MouseEvent) {
    this.resizing = true;
    this.renderer.addClass(document.body, 'resizing');
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    const newWidth = event.clientX - 80; // 80 = sidebar width
    const min = 200;
    const max = 600;
    const width = Math.max(min, Math.min(max, newWidth));

    document.documentElement.style.setProperty('--panel-width', `${width}px`);
  }

  @HostListener('document:mouseup')
  stopResizing() {
    if (this.resizing) {
      this.resizing = false;
      this.renderer.removeClass(document.body, 'resizing');
    }
  }
}
