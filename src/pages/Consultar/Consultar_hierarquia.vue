<template>
  <q-page class="q-pa-lg  shadow-4 ">
    <div class="row">
      <div class="col">
        <div class="row q-col-gutter-lg">

          <div class="col-12 ">
            <q-card class="transparent no-shadow">
              <q-breadcrumbs>
                <template v-slot:separator>
                  <q-icon
                    size="1.2em"
                    name="arrow_forward"
                    color="primary"
                  />
                </template>

                <q-breadcrumbs-el icon="dashboard" label="Dashboard" to="/dashboard" />
                <q-breadcrumbs-el to="/cadastro_hierarquia"  label="Cadastrar hierarquia" />
                <q-breadcrumbs-el icon="fas fa-search" to="/consultar_grupo"  label="Consultar hierarquia" />

              </q-breadcrumbs>

            </q-card>
          </div>

          <!-- Formulario usuario -->
          <div class="col-md-12 col-sm-12 col-xs-12 q-gutter-y-md row">

            <!-- Cabeçalho -->
            <q-card class="col-12 ">
              <q-card-section class=" q-col-gutter-sm text-center items-end">
                <div class="row col-12 justify-center q-gutter-x-xs">

                  <div class="col-md-3">

                    <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                      <template v-slot:prepend>
                        <q-btn :icon="dados ? 'refresh' : 'search'" @click="buscarHierarquias" flat dense round/>
                      </template>
                    </q-input>

                  </div>

                  <q-space />

                  <div class="col-md-3">

                    <q-select
                      v-model="visibleColumns"
                      multiple
                      outlined
                      dense
                      options-dense
                      display-value="Colunas"
                      emit-value
                      map-options
                      :options="columns"
                      option-value="name"
                      style="min-width: 200px; "
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-show="!scope.opt.required"
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-section>
                            <q-item-label v-html="scope.opt.label" />
                          </q-item-section>

                          <q-item-section avatar>
                            <q-toggle
                              disable
                              v-model="scope.itemProps.active"
                              color="primary"
                            />
                          </q-item-section>
                        </q-item>

                      </template>

                    </q-select>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="col-12">

              <q-table
                :loading="loading"
                :filter="filter"
                :data="dados ? data : na"
                :columns="columns"
                :visible-columns="visibleColumns"
                :separator="separator"
                selection="single"
                :selected.sync="selected"
                row-key="id">

                <!-- Corpo da tabela -->
                <template v-slot:body="props">
                  <q-tr :props="props" >
                    <q-td auto-width>
                      <q-btn dense icon="edit" flat round @click="props.selected = !props.selected"/>
                      <q-btn dense icon="delete" color="red-8" flat round />
                    </q-td>
                    <q-td key="id" :props="props">{{ props.row.id }}</q-td>
                    <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
                    <q-td key="status" :props="props">{{ props.row.status }}</q-td>
                  </q-tr>
                </template>

              </q-table>
            </div>

          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import Hierarquia from '../../service/hierarquia/hierarquia.js'

export default {
  data () {
    return {
      loading: false,
      dados: false,
      filtroPesquisa: [],
      filter: '',
      selected: [],
      visibleColumns: ['nome', 'status'],
      separator: 'horizontal',
      data: [],
      columns: [
        { required: true, name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true }
      ]
    }
  },
  computed: {

  },
  mounted () {
    this.buscarHierarquias()
  },
  methods: {
    buscarHierarquias () {
      this.loading = true
      Hierarquia.buscar()
        .then((hierarquia) => {
          if (hierarquia.data.errors) {
            for (let i = 0; i < hierarquia.data.errors.length; i++) {
              this.$q.notify({
                color: 'negative',
                message: hierarquia.data.errors[i].message,
                position: 'top-right',
                icon: 'warning',
                timeout: 2000,
                actions: [{
                  color: 'white',
                  icon: 'close'
                }]
              })
            }
          }
          if (hierarquia.data.status === 200) {
            this.dados = true
            this.data = hierarquia.data.response.map((h) => {
              return {
                id: h.id_hierarquia,
                nome: h.nome,
                status: h.ativo ? 'Ativo' : 'Inativo'
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
          this.$q.notify({
            color: 'negative',
            message: `Ocorreu um erro inesperado, entre em contato com o suporte`,
            position: 'top-right',
            icon: 'warning',
            timeout: 2000,
            actions: [{
              color: 'white',
              icon: 'close'
            }]
          })
          this.$q.notify({
            color: 'negative',
            message: `${error}`,
            position: 'top-right',
            icon: 'warning',
            timeout: 2000,
            actions: [{
              color: 'white',
              icon: 'close'
            }]
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>

legend {
  padding: 0.2em 0.5em;
  font-size:90%;
  color: grey;
  text-align:left;
}
</style>
