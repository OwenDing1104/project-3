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
    `;
  }

  constructor() {
    super();
    this.name = 'OwenDingTV';
    this.source = './assets/channels.json';
    this.listings = [];
    this.activeItem = null;
    this.currentIndex = 0; // Initialize to the first item
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
          ${this.activeItem && this.activeItem.metadata.source ? html`
            <video-player
              source="${this.activeItem.metadata.source}"
              accent-color="orange"
              dark
            ></video-player>
            <div id="navigationButtons">
              <button ?disabled="${this.currentIndex <= 0}" @click="${this.prevItem}">Previous Page</button>
              <button ?disabled="${this.currentIndex >= this.listings.length - 1}" @click="${this.nextItem}">Next Page</button>
            </div>
          ` : html`<p>Select a topic from the sidebar to show its content here.</p>`}
        </div>
      </div>
    `;
  }

  selectItem(index) {
    this.currentIndex = index;
    this.activeItem = this.listings[index];
    this.requestUpdate();
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
        this.activeItem = this.listings[this.currentIndex]; // Initialize the active item
      }
    } catch (error) {
      console.error('Could not fetch listings:', error);
    }
  }
}

customElements.define('tv-app', TvApp);
