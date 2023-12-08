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
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        height: 100vh;
      }
      .lecture-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 32px;
        height: calc(100% - 32px);
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
        width: 700px;
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
        margin-top: 20px;
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
    `;
  }

  constructor() {
    super();
    this.name = 'OwenDingTV';
    this.source = './assets/channels.json';
    this.listings = [];
    this.activeItem = null;
    this.currentIndex = 0;
    this.content = '';
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
        ` : ''}
        <div id="navigationButtons">
          <button ?disabled="${this.currentIndex <= 0}" @click="${this.prevItem}">Previous Page</button>
          <button ?disabled="${this.currentIndex >= this.listings.length - 1}" @click="${this.nextItem}">Next Page</button>
        </div>
      </div>
    </div>
  `;
}

  selectItem(index) {
    this.currentIndex = index;
    this.activeItem = this.listings[index];
    this.fetchContentForActiveItem();
  }

  async fetchContentForActiveItem() {
    if (this.activeItem && this.activeItem.location) {
      try {
        const response = await fetch(`./assets/${this.activeItem.location}`);
        if (response.ok) {
          this.content = await response.text();
        } else {
          console.error('Could not fetch content for:', this.activeItem.title);
          this.content = ''; 
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        this.content = ''; 
      }
    }
  }

  prevItem() {
    if (this.currentIndex > 0) {
      this.selectItem(this.currentIndex - 1);
    }
  }

  nextItem() {
    if (this.currentIndex < this.listings.length - 1) {
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
