import { LitElement, html, css } from 'lit';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object },
      currentIndex: { type: Number },
      content: { type: String },
      timeRemaining: { type: Number },
      totalTime: { type: Number },
      currentPageTime: { type: Number },
      timer: { type: Object }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
        height: 100vh;
      }
      .lecture-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 50px;
        height: 900px;
      }
      .lecture-screen {
        grid-column: 2;
        grid-row: 1;
        position: relative;
        overflow-y: auto;
      }
      .tv-channel-list {
        grid-column: 1;
        grid-row: 1;
        overflow-y: auto;
      }
      video-player {
        width: 800px;
        max-height: 500px;
      }
      #navigationButtons {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
      button {
        padding: 8px 16px;
        background: #007bff;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 16px;
      }
      button:disabled {
        background: #cccccc;
      }
      .content {
        margin-top: 60px;
      }
      p { 
        font-size: 14px;
        border: 1px solid #cccccc;
        padding: 20px;
        border-radius: 4px;
      }
      h1 {
        font-size: 32px;
        font-weight: bold;
      }
      h2 {
        font-size: 20px;
        font-weight: bold;
      }
      .timer {
        position: fixed;
        top: 10px;
        right: 50px;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        font-size: 0.9em;
      }
    `;
  }

  constructor() {
    super();
    this.name = 'OwenDingTV';
    this.source = './assets/channels.json';
    this.listings = [];
    this.activeItem = null;
    this.currentIndex = 0;
    this.remainingTime = 0;
    this.canNavigateNext = false;
  }

  render() {
    return html`
      <div class="lecture-container">
        <div class="tv-channel-list">
          ${this.listings.map((item, index) => html`
            <tv-channel
              title="${item.title}"
              description="${item.description}"
              .index="${index + 1}"
              @click="${() => this.selectItem(index)}"
            ></tv-channel>
          `)}
        </div>
        <div class="lecture-screen">
          ${this.activeItem ? html`
            <div class="video-and-content">
              ${this.activeItem.metadata.source ? html`
                <video-player
                  source="${this.activeItem.metadata.source}"
                  accent-color="orange"
                  dark
                ></video-player>
              ` : ''}
              <div class="content" .innerHTML="${this.content}"></div>
            </div>
            <div id="navigationButtons">
              <button ?disabled="${this.currentIndex <= 0}" @click="${this.prevItem}">Previous Page</button>
              <button ?disabled="${!this.canNavigateNext}" @click="${this.nextItem}">Next Page</button>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="timer">
        Time left: ${this.formatTime(this.remainingTime)}
      </div>
    `;
  }

  selectItem(index) {
    this.currentIndex = index;
    this.activeItem = this.listings[index];
    this.fetchContentForActiveItem();
    this.startPageTimer();
  }

  async fetchContentForActiveItem() {
    if (this.activeItem && this.activeItem.location) {
      const response = await fetch(`./assets/${this.activeItem.location}`);
      if (response.ok) {
        this.content = await response.text();
      } else {
        console.error('Could not fetch content for:', this.activeItem.title);
        this.content = ''; // Reset content if the fetch fails
      }
    }
  }

  startPageTimer() {
    clearInterval(this.pageTimer);
    this.remainingTime = parseInt(this.activeItem.metadata.time);
    this.canNavigateNext = false;

    this.pageTimer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.canNavigateNext = true;
        clearInterval(this.pageTimer);
      }
      this.requestUpdate();
    }, 1000);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  prevItem() {
    if (this.currentIndex > 0) {
      this.selectItem(this.currentIndex - 1);
    }
  }

  nextItem() {
    if (this.canNavigateNext && this.currentIndex < this.listings.length - 1) {
      this.selectItem(this.currentIndex + 1);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchListings();
  }

  async fetchListings() {
    try {
      const response = await fetch(this.source);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      if (json.status === 200 && json.data.items) {
        this.listings = json.data.items;
        this.selectItem(0); // Select the first item by default
      }
    } catch (error) {
      console.error('Could not fetch listings:', error);
    }
  }
}

customElements.define('tv-app', TvApp);