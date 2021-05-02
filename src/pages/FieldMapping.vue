<template>
  <q-layout view="hHh lpR fFf" class="content" id="fields-layout">
    <q-page-container>
      <q-page class="select-page" v-if="page === 'options'">
        <div class="q-gutter-md">
          <q-btn unelevated color="positive" label="Create New" @click="page = 'mapping'"></q-btn>
          <q-btn unelevated color="secondary" label="Import From Settings" @click="page = 'map-settings'"></q-btn>
          <q-btn unelevated color="warning" label="Import JSON" @click="page = 'import-json'"></q-btn>
        </div>
      </q-page>


      <q-page class="mapping-page" v-if="page === 'mapping'">
        <div class="q-pa-md">
          <p class="text-bold text-large content-title">Settings</p>
          <p class="text-grey">Field mapping is required for this app to function properly.</p>
        </div>
        <div class="q-gutter-md q-pa-md">
          <q-btn unelevated color="positive" label="Save Settings" @click="saveMapping"></q-btn>
          <q-btn unelevated color="warning" label="Export JSON" @click="exportJSON"></q-btn>
          <q-btn unelevated color="primary" label="Import JSON" @click="$refs.importFile.click()"></q-btn>
          <input type="file" hidden name="file" ref="importFile" @change="importJSON">
        </div>
        <q-tabs
          v-model="tab"
          narrow-indicator
          dense
          align="justify"
        >
          <q-tab v-for="(t, i) in template" :key="i" :class="t.class" :name="t.id" :icon="t.icon" :label="t.title" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel v-for="(t, i) in template" :key="i" :name="t.id">
            <div class="text-h6">{{ t.title }}</div>
            <div class="q-gutter-md q-pa-md">
              <q-select
                outlined
                stack-label
                v-model="t.mapped"
                :options="boardOptions"
                label="Board"
                :error="displayError && !t.mapped && !t.optional"
              />
            </div>

            <q-separator/>

            <div class="q-pa-md">
              <div class="q-gutter-md" layout="rows top-left">
                <q-select class="column-select" v-for="column in t.columns" :key="column.id"
                          :disable="!t.mapped"
                          outlined
                          stack-label
                          v-model="column.mapped"
                          :options="getColumnOptions(t, column)"
                          :label="column.title"
                          :error="displayError && !column.mapped && !t.optional"
                />
              </div>
            </div>

            <q-separator/>

            <div class="q-pa-md" v-if="t.sub">
              <div class="q-gutter-md" layout="rows top-left">
                <q-select class="column-select" v-for="column in t.sub.columns" :key="column.id"
                          :disable="!t.mapped"
                          outlined
                          stack-label
                          v-model="column.mapped"
                          :options="getSubBoardColumnOptions(t, column)"
                          :label="column.title"
                          :error="displayError && !column.mapped && !t.optional"
                />
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {getSchemaFromMonday, saveMapping} from "src/modals/schema";
import ui from "src/ui";

import template from 'src/modals/mapping-template'
import {extend} from "quasar";
import {provideDownload, readUploadedFile} from "src/utils";

export default {
  name: "FieldMapping",

  data() {
    return {
      page: 'mapping',
      boards: null,
      tab: 'category',
      template: Object.values(extend(true, {}, template)),
      displayError: false
    }
  },

  computed: {
    boardOptions() {
      if (!this.boards) return [];
      return this.boards.map(b => { return { label: b.name, value: b.id } })
    }
  },

  watch: {
    boards(boards) {
      this.template = this.template.map(template => {
        const board = boards.find(b => template.tags.includes(b.name.toLowerCase()));

        if (board) {
          template.mapped = { label: board.name, value: board.id }

          template.columns = template.columns.map(column => {
            const found = board.columns.find(bc => {
              if (!column.tags) {
                column.tags = [column.title.toLowerCase()]
              }

              return column.tags.includes(bc.title.toLowerCase());
            });

            if (found) {
              column.mapped = { label: found.title, value: found.id };
            }

            return column;
          });

          if (template.sub) {
            const findBoard = boards.find(b => b.name === `Subitems of ${board.name}`);

            if (findBoard) {
              template.sub.columns = template.sub.columns.map(column => {
                const found = findBoard.columns.find(bc => {
                  if (!column.tags) {
                    column.tags = [column.title.toLowerCase()]
                  }

                  return column.tags.includes(bc.title.toLowerCase());
                });

                if (found) {
                  column.mapped = { label: found.title, value: found.id };
                }

                return column;
              })
            }
          }
        }

        return template;
      })
    }
  },

  methods: {
    async init() {
      ui.showLoader("Setting up... Please wait...")
      this.boards = await getSchemaFromMonday();
      ui.hideLoader();
    },

    getColumnOptions(template, column) {
      if (!template.mapped) {
        return [];
      }

      const find = this.boards.find(b => +b.id === +template.mapped.value);
      return find.columns.filter(c => column.type.includes(c.type)).map(c => { return { label: c.title, value: c.id } });
    },

    getSubBoardColumnOptions(template, column) {
      if (!template.mapped) {
        return [];
      }

      const find = this.boards.find(b => +b.id === +template.mapped.value);
      const findBoard = this.boards.find(b => b.name === `Subitems of ${find.name}`);
      return findBoard.columns.filter(c => column.type.includes(c.type)).map(c => { return { label: c.title, value: c.id } });
    },

    generateJSON() {
      const data = {};
      this.template.forEach(t => {
        const d = {
          mapped: t.mapped?.value,
          columns: {},
          status: {}
        }
        let id = t.id;

        t.columns.forEach(c => d.columns[c.id] = c.mapped?.value);

        if (t.sub) {
          d.sub = { columns: {}, status: {} }
          t.sub.columns.forEach(c => d.sub.columns[c.id] = c.mapped?.value)
        }

        data[id] = d;

        if (!t.mapped) {
          return;
        }

        const find = this.boards.find(b => +b.id === +t.mapped.value);
        t.columns.forEach(c => {
          if (!c.mapped || !c.options) return;

          const bc = find.columns.find(bc => bc.id === c.mapped.value);
          const labels = Object.keys(bc.settings.labels).map(l => { return [bc.settings.labels[l].toLowerCase(), l] });

          d.status[c.id] = {};
          c.options.forEach(o => {
            const tags = o.tags ? o.tags : [o.id]
            const label = labels.find(l => tags.includes(l[0]));
            if (!label) return;
            d.status[c.id][o.id] = { id: label[1], color: bc.settings['labels_colors'][label[1]]['color'] };
          })
        });

        if (t.sub) {
          const findS = this.boards.find(b => b.name === `Subitems of ${find.name}`);
          t.sub.columns.forEach(c => {
            if (!c.mapped || !c.options) return;

            const bc = findS.columns.find(bc => bc.id === c.mapped.value);
            const labels = Object.keys(bc.settings.labels).map(l => { return [bc.settings.labels[l].toLowerCase(), l] });

            d.sub.status[c.id] = {};
            c.options.forEach(o => {
              const tags = o.tags ? o.tags : [o.id]
              const label = labels.find(l => tags.includes(l[0]));
              if (!label) return;
              d.sub.status[c.id][o.id] = { id: label[1], color: bc.settings['labels_colors'][label[1]]['color'] };
            })
          });
        }

      });

      return data;
    },

    exportJSON() {
      const data = this.generateJSON();
      provideDownload(data, 'field-map-export.json')
    },

    async importJSON(e) {
      const data = await readUploadedFile(e.target.files[0]);

      this.template.forEach(t => {
        t.mapped = null;
        t.columns.forEach(c => c.mapped = null)
        t.sub?.columns.forEach(c => c.mapped = null)

        if (!data[t.id]) return;

        const find = this.boards.find(b => +b.id === +data[t.id].mapped);
        if (!find) return;

        t.mapped = { label: find.name, value: data[t.id].mapped }
        t.columns.forEach(c => {
          if (data[t.id].columns[c.id]) {
            const bc = find.columns.find(bc => bc.id === data[t.id].columns[c.id])
            if (!bc) return;
            c.mapped = { label: bc.title, value: data[t.id].columns[c.id] }
          }
        })

        if (t.sub) {
          const findBoard = this.boards.find(b => b.name === `Subitems of ${find.name}`);
          if (!findBoard) return;

          t.sub.columns.forEach(c => {
            if (data[t.id].sub.columns[c.id]) {
              const bc = findBoard.columns.find(bc => bc.id === data[t.id].sub.columns[c.id])
              if (!bc) return;
              c.mapped = { label: bc.title, value: data[t.id].sub.columns[c.id] }
            }
          })
        }
      })
    },

    async saveMapping() {
      const ft = this.template.find(t => {
        if (t.optional) return false;
        if (!t.mapped) return true;

        if (t.columns.find(c => !c.mapped)) return true;

        if (t.sub) {
          if (t.sub.columns.find(c => !c.mapped)) return true;
        }
      });

      if (ft) {
        this.tab = ft.id;
        this.displayError = true;
        return;
      }

      const data = this.generateJSON();
      await saveMapping(data);
      await this.$router.push('/');
    }
  },

  created() {
  },

  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.select-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.content-title {
  font-size: 20px;
}

.column-select {
  min-width: 200px;
}
</style>
