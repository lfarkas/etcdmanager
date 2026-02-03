import Vue from 'vue';
import Component from 'vue-class-component';
import Mousetrap from 'mousetrap';

@Component({
})
export default class Dialog extends Vue {
    private keyboardEvents: ReturnType<typeof Mousetrap> | null = null;

    mounted() {
        this.keyboardEvents = new Mousetrap();
        this.keyboardEvents.stopCallback = () => false;
        this.keyboardEvents.bind('esc', () => {
            this.cancel();
        });
    }

    beforeDestroy() {
        // Clean up keyboard events to prevent memory leaks
        if (this.keyboardEvents) {
            this.keyboardEvents.reset();
            this.keyboardEvents = null;
        }
    }

    confirm() {
        this.$emit('confirm');
    }

    cancel() {
        this.$emit('cancel');
    }
}
