var app = angular.module('app', []);

var module = angular.module('app', ['angularGrid']);

/*Funções referentes ao Grid*/


module.controller('RelatorioController', ['$scope', '$http', function ($scope, $http) {

//module.controller('RelatorioController', function ($scope, $http) {

    var columnDefs = [
        { displayName: "Cliente", field: "NomeCliente" },
        { displayName: "Setor", field: "NomeSetor" },
        { displayName: "Documento", field: "DescricaoDocumento" , width : 450 },
        { displayName: "Lote", field: "NumeroLote", width: 70 },
        { displayName: "Caixa", field: "NumeroCaixaCliente" , width: 70 }
    ];

    var rowData = [];
    $scope.groupBy = '';
    $scope.gridOptions = {
        columnDefs: columnDefs,
        enableColResize: true,
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        angularCompileRows: true,
        groupUseEntireRow: true,
        groupAggFunction: groupAggFunction,
        groupInnerCellRenderer: groupInnerCellRendererFunc,
        groupKeys: undefined,
        rowData: rowData,
        dontUseScrolls: false // because so little data, no need to use scroll bars
    };

    //app.controller('RelatorioController', ['$scope', '$http', function ($scope, $http) {
    // inicializa a variavel com todas as mantenedoras

    $scope.init = function () {
        $scope.SetorAtual = "";
        $scope.permissaoFull = true;
        $scope.exibirCarregando = false;

        $scope.Clientes = null;
        $scope.Descritores = null;
        $http({
            method: 'GET',
            url: '/SIGA/Documentos/GetTodasMantenedoras',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })        
        .success(function (data) {
            $scope.erroBusca = 0;
            if (data == '') {
                $scope.erroBusca = 1;
            }
            $scope.Mantenedoras = data;
        }).error(function (data) {
            $scope.erroBusca = 1;
            $scope.Mantenedoras = null;
        });

    };

    $scope.loadClientes = function () {
        $scope.Setores = null;
        $scope.TiposDocumento = null;
        $scope.Descritores = null;
        $http({
            method: 'POST',
            url: '/SIGA/Documentos/GetClientesMantenedora',
            data: { idMantenedora: $scope.MantenedoraSelecionada },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {
            $scope.erroBusca = 0;
            if (data == '') {
                $scope.erroBusca = 1;
            }
            $scope.Clientes = data;
        }).error(function (data) {
            $scope.erroBusca = 1;
            $scope.Clientes = null;
        });
    };

    $scope.loadSetores = function () {
        $scope.TiposDocumento = null;
        $scope.Descritores = null;
        $http({
            method: 'POST',
            url: '/SIGA/ClientesTiposDocumentos/CarregaListaDeSetoresDoCliente',
            data: { idCliente: $scope.ClienteSelecionado },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {
            $scope.erroBusca = 0;
            if (data == '') {
                $scope.erroBusca = 1;
            }
            $scope.Setores = data;
        }).error(function (data) {
            $scope.erroBusca = 1;
            $scope.Setores = null;
        });

        $http({
            method: 'GET',
            url: '/SIGA/Clientes/GetDetalheCliente?idCliente=' + $scope.ClienteSelecionado
        })
        .success(function (data) {
            console.log(data);
            $scope.DadosCliente = data;
        }).error(function (data) {
            $scope.DadosCliente = null;
        });

    };

    $scope.ListarDocumentos = function () {
        $scope.SetorAtual = "";
        $scope.exibirCarregando = true;
        $scope.Documentos = null;
        var setor = 0;
        if ($scope.SetorSelecionado > 0) {
            setor = $scope.SetorSelecionado;
        }
        var dictionary = {};
        var listaImputs = document.getElementsByClassName('descritor');
        for (var i = 0; i < listaImputs.length; i++) {
            dictionary[listaImputs[i].id] = listaImputs[i].value;
        }
        if (dictionary == null || dictionary == '') {
            dictionary[0] = '';
        }

        $http({
            method: 'POST',
            url: '/SIGA/Relatorios/RecuperarListaDocumentosInventario',
            data: {
                idMantenedora: $scope.MantenedoraSelecionada,
                idCliente: $scope.ClienteSelecionado,
                idSetor: setor
            },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {
            $scope.erroBusca = 0;
            if (data == '') {
                $scope.erroBusca = 1;
            }
            $scope.Documentos = data;
            $scope.gridOptions.rowData = data;
            $scope.gridOptions.api.onNewRows();
            $scope.exibirCarregando = false;
        }).error(function (data) {
            $scope.erroBusca = 1;
            $scope.Documentos = null;
            $scope.exibirCarregando = false;
        });
    };

    $scope.GetExcelDocumentos = function () {
        $scope.SetorAtual = "";
        $scope.exibirCarregando = true;
        $scope.Documentos = null;
        var setor = 0;
        if ($scope.SetorSelecionado > 0) {
            setor = $scope.SetorSelecionado;
        }
        var dictionary = {};
        var listaImputs = document.getElementsByClassName('descritor');
        for (var i = 0; i < listaImputs.length; i++) {
            dictionary[listaImputs[i].id] = listaImputs[i].value;
        }
        if (dictionary == null || dictionary == '') {
            dictionary[0] = '';
        }

        $http({
            method: 'POST',
            url: '/SIGA/Relatorios/RecuperarListaDocumentosInventarioExcel',
            data: {
                idMantenedora: $scope.MantenedoraSelecionada,
                idCliente: $scope.ClienteSelecionado,
                idSetor: setor
            },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {                      
            $scope.exibirCarregando = false;
        }).error(function (data) {
            $scope.erroBusca = 1;            
            $scope.exibirCarregando = false;
            alert(data);
        });
        $scope.exibirCarregando = false;

    };

    $scope.onGroupByChanged = function () {
        // setup keys
        var groupBy = null;
        if ($scope.groupBy !== "") {
            groupBy = $scope.groupBy.split(",");
        }
        $scope.gridOptions.groupKeys = groupBy;
        //$scope.gridOptions.groupKeys = ['NomeCliente', 'NumeroCaixaCliente'];

        // setup type
        //var groupUseEntireRow = $scope.groupType === 'row' || $scope.groupType === 'rowWithFooter';
        //$scope.gridOptions.groupUseEntireRow = true;

        //// use footer or not
        //var useFooter = $scope.groupType === 'colWithFooter' || $scope.groupType === 'rowWithFooter';
        $scope.gridOptions.groupIncludeFooter = true;

        $scope.gridOptions.api.onNewRows();
    };

    function groupAggFunction(rows) {

        var sums = {
            
            total: 0
        };
        rows.forEach(function (row) {

            if (row.children != null) {
                row.children.forEach(function (child) {
                    var c = child.data;
                    sums.total += 1;
                });
            }
            else {
                var data = row.data;
                sums.total += 1;
            }
        });

        return sums;
    }

    function groupInnerCellRendererFunc(params) {
        
        var html = '';
        
        html += '<span> NomeGrupo </span>'.replace('NomeGrupo', params.node.key);
        html += '<i class="fa fa-angle-double-right"></i> <span> Total Documentos: TOTAL_DOCUMENTOS</span>'.replace('TOTAL_DOCUMENTOS', params.data.total);
        
        return html;
    }



}
]
);