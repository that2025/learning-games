/* ==========================================================================
   Activity Manager & Lesson Library Modal
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Filter tabs (All, Custom, Samples), Play Now, Edit, Duplicate, Single & Bulk Delete
   ========================================================================== */

import { dataManager } from '../data.js';
import { sound } from '../audio.js';
import { i18n } from '../i18n.js';

export class ActivityManagerModal {
  constructor(onSelectActivity, onEditActivity) {
    this.modalEl = null;
    this.currentFilter = 'all';
    this.onSelectActivity = onSelectActivity;
    this.onEditActivity = onEditActivity;
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-activity-manager';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 900px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>📚</span>
            <span class="modal-title" data-i18n="managerTitle">${i18n.t('managerTitle')}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-manager">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Filter Tabs -->
          <div class="modal-tabs">
            <button class="modal-tab-btn active" data-filter="all">
              <span>🌐</span> <span data-i18n="tabAll">${i18n.t('tabAll')}</span>
            </button>
            <button class="modal-tab-btn" data-filter="custom">
              <span>✏️</span> <span data-i18n="tabCustom">${i18n.t('tabCustom')}</span>
            </button>
            <button class="modal-tab-btn" data-filter="system">
              <span>⭐</span> <span data-i18n="tabSystem">${i18n.t('tabSystem')}</span>
            </button>
          </div>

          <!-- Activity Cards Grid -->
          <div id="manager-activities-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            <!-- Rendered cards -->
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button class="nav-btn btn-danger" id="btn-delete-all-custom">
            <span>⚠️</span> <span data-i18n="btnDeleteAllCustom">${i18n.t('btnDeleteAllCustom')}</span>
          </button>
          <button class="nav-btn" id="btn-close-manager-footer">${i18n.t('btnCancel')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-close-manager')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-close-manager-footer')?.addEventListener('click', () => this.close());

    // Filter Tabs
    this.modalEl.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        this.modalEl.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderActivities();
      });
    });

    // Delete All Custom
    this.modalEl.querySelector('#btn-delete-all-custom')?.addEventListener('click', () => {
      const customCount = dataManager.getCustomActivities().length;
      if (customCount === 0) {
        alert("មិនមានមេរៀនផ្ទាល់ខ្លួនសម្រាប់លុបទេ (No custom activities to delete)");
        return;
      }

      if (confirm(i18n.t('confirmDeleteAll'))) {
        sound.playWrong();
        dataManager.deleteAllCustomActivities();
        this.renderActivities();
        window.dispatchEvent(new CustomEvent('activitylistchanged'));
      }
    });
  }

  open() {
    this.renderActivities();
    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  renderActivities() {
    const grid = this.modalEl.querySelector('#manager-activities-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let list = [];
    if (this.currentFilter === 'all') {
      list = dataManager.getAllActivities();
    } else if (this.currentFilter === 'custom') {
      list = dataManager.getCustomActivities();
    } else if (this.currentFilter === 'system') {
      list = dataManager.getSampleActivities();
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <div>${i18n.t('noCustomActivities')}</div>
        </div>
      `;
      return;
    }

    list.forEach(act => {
      const title = typeof act.title === 'object' ? (act.title.km || act.title.en) : act.title;
      const desc = typeof act.description === 'object' ? (act.description.km || act.description.en) : act.description;
      const cat = typeof act.category === 'object' ? (act.category.km || act.category.en) : (act.category || 'ទូទៅ');
      const count = act.items ? act.items.length : 0;

      const card = document.createElement('div');
      card.className = 'manager-activity-card';
      card.style.cssText = `
        background: var(--card-bg);
        border: 1px solid var(--panel-border);
        border-radius: 14px;
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.85rem;
        transition: transform 0.2s, border-color 0.2s;
      `;

      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="arena-badge category">${cat}</span>
            <span class="arena-badge">${count} ${i18n.t('itemsCountBadge') || 'items'}</span>
          </div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.3rem;">
            ${title}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.35;">
            ${desc}
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; flex-wrap: wrap;">
          <button class="nav-btn btn-create btn-play-act" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
            ${i18n.t('btnPlayNow')}
          </button>
          <div style="display: flex; gap: 0.3rem;">
            <button class="nav-btn btn-edit-act" title="Edit" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">✏️</button>
            <button class="nav-btn btn-dup-act" title="Duplicate" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">📋</button>
            ${!act.isSample ? `<button class="nav-btn btn-danger btn-del-act" title="Delete" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">🗑️</button>` : ''}
          </div>
        </div>
      `;

      card.querySelector('.btn-play-act')?.addEventListener('click', () => {
        sound.playPop();
        this.close();
        if (this.onSelectActivity) this.onSelectActivity(act);
      });

      card.querySelector('.btn-edit-act')?.addEventListener('click', () => {
        sound.playPop();
        this.close();
        if (this.onEditActivity) this.onEditActivity(act);
      });

      card.querySelector('.btn-dup-act')?.addEventListener('click', () => {
        sound.playMatch();
        dataManager.duplicateActivity(act.id);
        this.renderActivities();
        window.dispatchEvent(new CustomEvent('activitylistchanged'));
      });

      card.querySelector('.btn-del-act')?.addEventListener('click', () => {
        if (confirm(i18n.t('confirmDeleteSingle'))) {
          sound.playWrong();
          dataManager.deleteActivity(act.id);
          this.renderActivities();
          window.dispatchEvent(new CustomEvent('activitylistchanged'));
        }
      });

      grid.appendChild(card);
    });
  }
}
