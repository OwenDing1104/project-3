// tv-app.js
import { LitElement, html, css } from 'lit';

export class TvApp extends LitElement {
  constructor() {
    super();
    this.name = 'OwenDingTV';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.courses = [];
    this.activeItem = null;
  }

  static get tag() {
    return 'tv-app';
  }

  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      courses: { type: Array },
      activeItem: { type: Object },
    };
  }

  static get styles() {
    return css`
    :host {
      display: flex;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      height: 100vh; 
    }
    
    .sidebar {
      width: 250px; 
      overflow-y: auto;
      padding: 20px; 
      box-sizing: border-box;
      border-right: 1px solid #ccc;
    }
    
    .main-content {
      flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    
    h2, h3 {
      margin: 0 0 20px 0;
    }
    
    p {
      margin: 0 0 10px 0;
      cursor: pointer;
      word-break: break-word;
    }
    
    p:hover {
      text-decoration: underline;
    }
    
    video {
      width: 700px;
      max-height: 500px;
    }
    `;
  }

// Inside the TvApp class in tv-app.js

render() {
  const videoPlayerTemplate = this.activeItem && this.activeItem.metadata.source ? html`
    <iframe
      width="560"
      height="315"
      src="${this.activeItem.metadata.source}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  ` : null; // If there's no video URL, render nothing.

  // Render the sidebar with course titles and the main content with the video player and description.
  return html`
    <div class="sidebar">
      <h2>${this.name}</h2>
      ${this.courses.map(item => html`
        <p @click="${() => this.selectItem(item)}">${item.title}</p>
      `)}
    </div>
    <div class="main-content">
      <h3>${this.activeItem ? this.activeItem.title : 'Select a Topic'}</h3>
      <div id="videoPlayerContainer">${videoPlayerTemplate}</div>
      <p>${this.activeItem ? this.activeItem.description : 'Select a topic from the sidebar to show its content here.'}</p>
    </div>
  `;
}

  
  selectItem(item) {
    this.activeItem = item;
  
    const videoContainer = this.shadowRoot.querySelector('#videoPlayerContainer');
    const videoElement = videoContainer.querySelector('video') || document.createElement('video');
    const sourceElement = videoElement.querySelector('source') || document.createElement('source');
  
    sourceElement.src = this.activeItem.videoUrl;
    sourceElement.type = 'video/mp4';
    
    if (!videoElement.querySelector('source')) {
      videoElement.appendChild(sourceElement);
    }
  
    videoElement.load(); // This is necessary to load the new video after changing the source
  
    if (!videoContainer.querySelector('video')) {
      videoContainer.appendChild(videoElement);
    }
  
    this.requestUpdate();
  }
  
  

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchCourses();
  }

  async fetchCourses() {
    try {
      const response = await fetch(this.source);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      this.courses = json.data.items.map(item => {
        // Assuming 'source' might be directly on the item, not inside 'metadata'
        return {
          ...item,
          videoUrl: item.metadata?.source || item.source
        };
      });
      this.requestUpdate(); // Ensure the component updates with the new data
    } catch (error) {
      console.error('Could not fetch courses:', error);
    }
  }
}  

customElements.define('tv-app', TvApp);
