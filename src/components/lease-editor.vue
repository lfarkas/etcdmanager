<template>
    <v-card>
        <v-expansion-panel focusable dark class="help" v-model="help">
            <v-expansion-panel-content dark class="darker">
                <template v-slot:actions>
                    <v-tooltip
                        data-test="lease-editor.help.tooltip"
                        slot="prepend"
                        bottom
                        max-width="200"
                    >
                        <v-icon
                            data-test="lease-editor.help-tooltip.icon"
                            slot="activator"
                            color="primary"
                            light
                            medium
                            >help</v-icon
                        >
                        <span data-test="lease-editor.help-tooltip.span">{{
                            $t('common.help.tooltip')
                        }}</span>
                    </v-tooltip>
                </template>
                <template v-slot:header>
                    <v-toolbar-title
                        data-test="lease-editor.title.toolbar-title"
                        >{{  $t('leaseEditor.title')  }}: {{id}}</v-toolbar-title
                    >
                </template>
                <v-tabs
                    v-model="helpbar"
                    dark
                    color="black"
                    slider-color="primary"
                    grow
                >
                    <v-tab data-test="lease-editor.info.tab" ripple>{{
                        $t('common.help.tabs.info')
                    }}</v-tab>
                    <v-tab-item>
                        <v-card dark>
                            <v-card-text>
                                <h2
                                    data-test="lease-editor.tab-infoTitle.h2"
                                    class="title"
                                >
                                    {{ $t('common.help.infoTitle') }}
                                </h2>
                                <p
                                    data-test="lease-editor.tab-spacer-1.p"
                                    class="spacer"
                                ></p>
                                <!-- eslint-disable vue/no-v-html -->
                                <p
                                    data-test="lease-editor.tab-text.p"
                                    v-html="
                                        platformService.getHelp(
                                            $t('leaseEditor.help.text')
                                        )
                                    "
                                ></p>
                                <!-- eslint-enable vue/no-v-html -->
                                <p
                                    data-test="lease-editor.tab-spacer-2.p"
                                    class="spacer"
                                ></p>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab data-test="lease-editor.shortcuts.tab" ripple>{{
                        $t('common.help.tabs.shortcuts')
                    }}</v-tab>
                    <v-tab-item>
                        <v-card dark>
                            <v-card-text>
                                <v-layout align-center justify-start row>
                                    <v-flex xs4>
                                        <p
                                            data-test="lease-editor.shortcuts-closeEditor-rounded.p"
                                            class="rounded"
                                        >
                                            esc
                                        </p>
                                    </v-flex>
                                    <v-flex xs8>
                                        <p
                                            data-test="lease-editor.shortcuts-closeEditor-label.p"
                                            class="label"
                                        >
                                            {{
                                                $t(
                                                    'common.help.shortcuts.closeEditor'
                                                )
                                            }}
                                        </p>
                                    </v-flex>
                                </v-layout>
                                <v-layout align-center justify-start row>
                                    <v-flex xs4>
                                        <p
                                            data-test="lease-editor.shortcuts-help-rounded.p"
                                            class="rounded"
                                        >
                                            {{
                                                `${platformService.getMeta()} + h`
                                            }}
                                        </p>
                                    </v-flex>
                                    <v-flex xs8>
                                        <p
                                            data-test="lease-editor.shortcuts-help-label.p"
                                            class="label"
                                        >
                                            {{
                                                $t('common.help.shortcuts.help')
                                            }}
                                        </p>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
                <hr data-test="lease-editor.blackline.hr" class="blackLine" />
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-container fill-height fluid>
            <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                    <v-form ref="leaseForm" v-model="valid" lazy-validation>

                        <v-text-field
                            data-test="lease-editor.grant.text-field"
                            dark
                            v-model="lease.grantedTTL"
                            :label="$t('leaseEditor.fields.grant.label')"
                            type="number"
                            readonly
                        >
                            <v-tooltip
                                data-test="lease-editor.grant.tooltip"
                                slot="prepend"
                                bottom
                                max-width="200"
                            >
                                <v-icon
                                    data-test="lease-editor.grant.icon"
                                    slot="activator"
                                    color="primary"
                                    dark
                                    >info</v-icon
                                >
                                <span data-test="lease-editor.grant.span">{{
                                    $t('leaseEditor.fields.grant.tooltip')
                                }}</span>
                            </v-tooltip>
                        </v-text-field>

                        <v-text-field
                            data-test="lease-editor.remainingDate.text-field"
                            dark
                            v-model="remainingDate"
                            :label="
                                $t('leaseEditor.fields.remainingDate.label')
                            "
                            required
                            readonly
                        >
                            <v-tooltip
                                data-test="lease-editor.remainingDate.tooltip"
                                slot="prepend"
                                bottom
                                max-width="200"
                            >
                                <v-icon
                                    data-test="lease-editor.remainingDate.icon"
                                    slot="activator"
                                    color="primary"
                                    dark
                                    >info</v-icon
                                >
                                <span
                                    data-test="lease-editor.remainingDate.span"
                                    >{{
                                        $t(
                                            'leaseEditor.fields.remainingDate.tooltip'
                                        )
                                    }}</span
                                >
                            </v-tooltip>
                        </v-text-field>

                        <h2
                            data-test="lease-editor.subheading.h2"
                            class="subheading"
                        >
                            {{ $t('leaseEditor.subtitle') }}
                        </h2>
                        <hr data-test="lease-editor.subheading.hr" />
                        <v-card
                            data-test="lease-editor.message-noRights.card"
                            height="200"
                            class="scrollable"
                        >
                            <div
                                data-test="lease-editor.message-noRights.checkbox"
                                v-for="key in keys"
                                v-bind:key="key.name"
                            >{{ key.name }}</div>
                        </v-card>
                        <v-btn
                            data-test="lease-editor.close.button"
                            color="warning"
                            round
                            @click="cancel"
                            >{{ $t('common.actions.close.label') }}</v-btn
                        >
                        <v-spacer
                            data-test="lease-editor.leaseForm.spacer"
                        ></v-spacer>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { ILeaseTimeToLiveResponse } from 'etcd3';
import { BaseEditor } from '../lib/editor.class';
import { Prop } from 'vue-property-decorator';
import { GenericObject } from '../../types';

@Component({
    name: 'lease-editor',
})
export default class LeaseEditor extends BaseEditor {
    public itemType: string = 'lease';
    public itemId: string = 'ID';

    // @ts-expect-error -- untyped
    @Prop() data: GenericObject;

    public id: string = '';

    created() {
        this.id = this.data?.ID || '';
    }

    public keys: GenericObject[] = [];
    private remaining: number = 0;
    // @ts-expect-error -- untyped
    private remainingDate: string = '';
    private interval: any = null;
    public lease: ILeaseTimeToLiveResponse | GenericObject = {};

    public async mounted() {
        this.bindDefaultEvents('leaseForm');
        this.lease = this.data;
        this.keys = (this.lease.keys || []).map((key: Buffer) => {
            return { name: key.toString() };
        });
        this.remaining = parseInt(this.lease.TTL as string, 10) || 0;
        this.updateRemainingDate();
        this.interval = setInterval(() => {
            this.remaining -= 1;
            if (this.remaining <= 0) {
                this.remaining = 0;
                clearInterval(this.interval);
                this.interval = null;
                this.remainingDate = 'Expired';
                return;
            }
            this.updateRemainingDate();
        }, 1000);
    }

    private updateRemainingDate() {
        const hours = Math.floor(this.remaining / 3600);
        const minutes = Math.floor((this.remaining % 3600) / 60);
        const seconds = this.remaining % 60;
        this.remainingDate = `${hours} hours / ${minutes} minutes / ${seconds} seconds`;
    }

    public destroyed() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
</script>

<style scoped>
.scrollable {
    overflow-y: auto;
}
</style>
