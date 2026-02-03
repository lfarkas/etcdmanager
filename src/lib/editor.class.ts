import { ClipboardService } from '@/services/clipboard.service';
import { PlatformService } from './../services/platform.service';
import { GenericObject } from './../../types/index';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { capitalize } from 'lodash-es';
import store from '@/store';
import Mousetrap, { ExtendedKeyboardEvent } from 'mousetrap';

@Component({
})
export class BaseEditor extends Vue {
    public loading: boolean = true;
    public valid = false;
    public itemId!: string;
    public itemType!: string;
    public headers: GenericObject[] = [];
    protected keyboardEvents: any;
    public help: number | null = null;
    public clipboardService: ClipboardService;
    public platformService: PlatformService;
    public helpbar: any = 0;

    @Prop() mode!: string;

    constructor() {
        super();
        this.clipboardService = new ClipboardService();
        this.platformService = new PlatformService();
    }

    protected focus(refName: string) {
        // @ts-ignore
        this.$nextTick(this.$refs[refName].focus);
    }

    protected bindDefaultEvents(refName: string) {
        // @ts-ignore
        const form = this.$refs[refName].$el;
        this.keyboardEvents = new Mousetrap(form as HTMLFormElement);
        this.keyboardEvents.bind('meta+s', (e: ExtendedKeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        });
        this.keyboardEvents.bind('enter', (e: ExtendedKeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        });
        this.keyboardEvents.bind('esc', (e: ExtendedKeyboardEvent) => {
            e.stopPropagation();
            this.cancel();
        });
        this.keyboardEvents.bind('meta+h', (e: ExtendedKeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.help = this.help === 0 ? null : 0;
        });
    }

    protected unbindDefaultEvents() {
        if (this.keyboardEvents) {
            this.keyboardEvents.reset();
        }
    }

    public destroyed() {
        // Clean up keyboard events to prevent memory leaks
        this.unbindDefaultEvents();
    }

    public translateHeaders(...keys: string[]) {
        keys.forEach((k, i) => {
            this.headers[i].text = this.$t(k).toString();
        });
    }

    get createMode() {
        return this.mode === 'create';
    }

    get editMode() {
        return this.mode === 'edit';
    }

    get title() {
        if (this.editMode) {
            // @ts-ignore
            return `${this.$t('common.titles.edit').toString()}: ${this[this.itemId.toLowerCase()]}`;
        }
        return `${this.$t('common.titles.new').toString()} ${capitalize(this.itemType)}`;
    }

    get opTitle() {
        return this.$t(this.createMode ? 'common.actions.add' : 'common.actions.save').toString();
    }

    public cancel() {
        this.$emit('cancel');
    }

    private loadingTimeout: ReturnType<typeof setTimeout> | null = null;

    public toggleLoading() {
        // Clear any pending timeout to avoid race conditions
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

        if (store.state.loading) {
            // Delay hiding the loading state to prevent flickering
            this.loadingTimeout = setTimeout(() => {
                store.commit('loading');
                this.loadingTimeout = null;
            }, 500);
        } else {
            store.commit('loading');
        }
    }

    protected submit() { }
}
