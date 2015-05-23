'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function($scope) {

        $scope.candidats = {
            0:{
                firstname:"Pauline",
                lastname:"Bou Khaled",
                skills:{
                    computer:{
                        "java":{
                            years:2,
                            level:"high"
                        },
                        "cpp":{
                            years:4,
                            level:"low"
                        },
                        "html":{
                            years:10,
                            level:"low"
                        },
                        "css":{
                            years:1,
                            level:"medium"
                        }
                    }
                },
                isSelected:false
            },
            1:{
                firstname:"Julien",
                lastname:"Tscherrig",
                skills:{
                    computer:{
                        "cpp":{
                            years:2,
                            level:"hight"
                        },
                        "html":{
                            years:10,
                            level:"hight"
                        },
                        "css":{
                            years:1,
                            level:"low"
                        }
                    }
                },
                isSelected:false
            },
            2:{
                firstname:"Omar",
                lastname:"Abou Khaled",
                skills:{
                    computer:{
                        "java":{
                            years:5,
                            level:"medium"
                        },
                        "cpp":{
                            years:2,
                            level:"hight"
                        }
                    }
                }
            }
        }

        $scope.jobs = {
            0:{
                name:"Dev CPP",
                skills:{
                    computer:{
                        "java":{
                            years:3,
                            level:"high"
                        },
                        "cpp":{
                            years:5,
                            level:"low"
                        }
                    }
                },
                isSelected:false
            },
            1:{
                name:"IT Manager",
                skills:{
                    computer:{
                        "cpp":{
                            years:1,
                            level:"low"
                        },
                        "html":{
                            years:4,
                            level:"high"
                        },
                        "css":{
                            years:4,
                            level:"medium"
                        }
                    }
                }
            },
            2:{
                name:"Network Administrator",
                skills:{
                    computer:{
                        "network":{
                            years:10,
                            level:"high"
                        },
                        "cpp":{
                            years:2,
                            level:"high"
                        }
                    }
                },
                isSelected:false
            },
            3:{
                name:"IT Manager 555",
                skills:{
                    computer:{
                        "cpp":{
                            years:10,
                            level:"low"
                        },
                        "html":{
                            years:3,
                            level:"high"
                        },
                        "css":{
                            years:8,
                            level:"medium"
                        }
                    }
                }
            }
        }


        $scope.init = function() {
            $scope.draw();
        }


        // Retourne la liste des jobs selectionnés
        $scope.getSelectedJobs = function() {
            var jobLst = [];
            for(var id in $scope.jobs) {
                var job = $scope.jobs[id];
                if (job.isSelected == true) {
                    jobLst.push(job);
                }
            }
            return jobLst;
        }

        // Retourne la liste des candidats selectionnés
        $scope.getSelectedCandidats = function() {
            var candidatLst = [];
            for(var id in $scope.candidats) {
                var job = $scope.candidats[id];
                if (job.isSelected == true) {
                    candidatLst.push(job);
                }
            }
            return candidatLst;
        }

        // Si array1 contient l'element elt
        $scope.arrayContains = function(array1, elt) {
            for(var id in array1) {
                var elt_ = array1[id];
                if(elt_==elt)
                    return true;
            }
            return false;
        }

        // Merge les tableaux en retenant qu'une seule fois chaque valeur
        $scope.fusionArray = function(array1, array2) {
            var a = [];
            for(var id in array1) {
                var elt = array1[id];
                a.push(elt);
            }
            for(var id in array2) {
                var elt = array2[id];
                if(!$scope.arrayContains(a, elt))
                    a.push(elt);
            }
            return a;
        }

        // Retourne la liste de competences pour un job ou un candidat
        $scope.getRequierdCompetences = function(jobOrCandidate) {
            var compLst = [];
            for(var id in jobOrCandidate.skills.computer)
                compLst.push(id);

            return compLst;
        }

        // Retourne toutes les competences des jobs selectionnes
        $scope.getSelectedJobCompetences = function() {
            var compFullLst = [];
            var jobs = $scope.getSelectedJobs();
            for(var id in jobs) {
                var compLst = $scope.getRequierdCompetences(jobs[id]);
                compFullLst  = $scope.fusionArray(compFullLst, compLst);
            }

            return compFullLst;
        }

        // retourne un tableau contenant la correspondance des competences en terme d'annees
        $scope.getSkillsYear = function(jobOrCandidate) {
            var r = [];
            var sortedComptences = $scope.getSelectedJobCompetences(); // ordre attentu
            var cs = $scope.getRequierdCompetences(jobOrCandidate) // a créer



            for(var id in sortedComptences) {
                if($scope.arrayContains(cs, sortedComptences[id])) {
                    r.push(jobOrCandidate.skills.computer[sortedComptences[id]].years);
                }else {
                    r.push(0);
                }

            }
            return r;
        }

        $scope.getSkillYear = function(comp, jobOrCandidate){
            for(var id in jobOrCandidate.skills.computer){
                if(id==comp){
                    return jobOrCandidate.skills.computer[id].years;
                }

            }
            return 0;
        }



        $scope.draw = function() {
            $scope.drawRadar();
            $scope.drawMultiCompMultiCand();
            $scope.drawMultiCompOneCand();
            $scope.drawOneCompMultiCand();
            $scope.drawOneCompMultiCandPieChart();
            $scope.listComp = $scope.getSelectedJobCompetences();
        }

        $scope.drawMultiCompOneCand = function(candidat) {
            if(candidat!= null && candidat == $scope.currentCand)
                return;

            console.log("AA" + candidat);
            if(candidat==null) {
                console.log("BB");
                candidat = $scope.getSelectedCandidats()[0]; // à traiter
            }

            $scope.currentCand = candidat;

            // On va charger en json les donnees pour les introduire dans highcharts
            var listComp = $scope.getSelectedJobCompetences();
            var compCand = $scope.getSkillsYear(candidat);
            var data = {
                chart: {
                    renderTo : 'containerMultiCompOneCand'
                },
                title: {
                    text: 'Compétences de '+candidat.firstname+" "+candidat.lastname
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: "Années d'expérience"
                    },
                    min: 0
                },
                xAxis: {
                    categories: listComp
                },

                series: []
            }

            data.series.push(
                {
                    type: 'column',
                    name: candidat.firstname+" "+candidat.lastname,
                    data: compCand
                }
            )

            var selectedJobs = $scope.getSelectedJobs();
            for(var id in selectedJobs) {
                var c = selectedJobs[id];
                var v = $scope.getSkillsYear(c);
                var n = c.name;
                data.series.push(
                    {
                        type: 'spline',
                        name: n,
                        data: v,
                        marker: {
                            lineWidth: 2
                        }
                    }
                )
            }

            var graph = new Highcharts.Chart(data);
            console.log(graph);

        }

        $scope.drawOneCompMultiCand = function() {

            var comp=$scope.listCompSelected;

            // On va charger en json les donnees pour les introduire dans highcharts
            var data = {
                chart: {
                    renderTo : 'containerOneCompMultiCand'
                },
                title: {
                    text: 'Compétence '+comp
                },

                xAxis: {
                    categories: [comp]
                },


                series: [],


                yAxis: {
                    plotLines: [],
                    allowDecimals: false,
                    max:10,
                    title: {
                        text: "Années d'expérience"
                    }
                }
            }

            var max = 0;

            var selectedCandidats = $scope.getSelectedCandidats();
            for(var id in selectedCandidats) {
                var c = selectedCandidats[id];
                var v = $scope.getSkillYear(comp, c);
                var n = c.firstname + " " + c.lastname;
                data.series.push({
                    type: 'column',
                    name: n,
                    data: [v]
                });
                if(v>max)
                    max = v;
            }

            var color =  ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
                    '#FF9655', '#FFF263', '#6AF9C4'];
            var i = 0;
            var selectedJobs = $scope.getSelectedJobs();
            for(var id in selectedJobs) {
                var c = selectedJobs[id];
                var v = $scope.getSkillYear(comp, c);
                var n = c.name;
                data.yAxis.plotLines.push({
                    color: color[i++%color.length],
                    dashStyle: 'line', // Style of the plot line. Default to solid
                    value: v, // Value of where the line will appear
                    width: 2,
                    zIndex: 100,
                    // Width of the line  
                    label: {
                        text: n // Content of the label.

                    }
                });
                if(v>max)
                    max = v;
            }

            data.yAxis.max = max;

            var graph = new Highcharts.Chart(data);
            console.log(graph);

        }

        $scope.drawOneCompMultiCandPieChart = function() {
            var comp=$scope.listCompSelected;

            // On va charger en json les donnees pour les introduire dans highcharts
            var data = {
                chart: {
                    renderTo : 'containerOneCompMultiCandPieChart',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Compétence '+comp
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: []
            }

            var selectedCandidats = $scope.getSelectedCandidats();

            var sub = {
                type: 'pie',
                name: 'Compétence ' + comp,
                data: []
            };

            for(var id in selectedCandidats) {
                var c = selectedCandidats[id];
                var v = $scope.getSkillYear(comp, c);
                var n = c.firstname + " " + c.lastname;
                console.log("__");
                console.log(data.series);
                console.log(data.series.data);
                sub.data.push({
                    name: n,
                    y: v
                });
            }
            data.series.push(sub);

            console.log(sub);
            var graph = new Highcharts.Chart(data);


        }

        $scope.drawRadar = function() {
            var data = {

                chart: {
                    renderTo : 'containerRadar',
                    polar: true,
                    type: 'line'
                },

                title: {
                    text: ''
                },

                pane: {
                    size: '80%'
                },

                xAxis: {
                    categories: [],
                    tickmarkPlacement: 'on',
                    lineWidth: 0
                },

                yAxis: {
                    gridLineInterpolation: 'polygon',
                    lineWidth: 0,
                    min: 0
                },

                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f} years of experience</b><br/>'
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },

                series: []

            };

            var selectedCandidats = $scope.getSelectedCandidats();
            for(var id in selectedCandidats) {
                var c = selectedCandidats[id];
                var v = $scope.getSkillsYear(c);
                var n = c.firstname + " " + c.lastname;
                data.series.push({
                    name: n,
                    data: v,
                    pointPlacement: 'on'
                })
            }

            var selectedJobs = $scope.getSelectedJobs();
            for(var id in selectedJobs) {
                var c = selectedJobs[id];
                var v = $scope.getSkillsYear(c);
                var n = c.name;
                data.series.push({
                    name: n,
                    data: v,
                    pointPlacement: 'on'
                })
            }

            data.xAxis.categories = $scope.getSelectedJobCompetences();
            console.log(data.xAxis.categories);
            $scope.radar = new Highcharts.Chart(data);


        }

        $scope.drawMultiCompMultiCand = function() {
            var listComp = $scope.getSelectedJobCompetences();
            var listCand = $scope.getSelectedCandidats();
            var listJob = $scope.getSelectedJobs();
            // On va charger en json les donnees pour les introduire dans highcharts
            var data = {
                chart: {
                    renderTo : 'containerMultiCompMultiCand'
                },
                title: {
                    text: 'Toutes les compétences'
                },
                xAxis: {
                    categories: listComp
                },
                yAxis:{
                    title:{
                        text: "Années d'expérience"
                    },
                    allowDecimals: false,

                },


                series: []
            }

            var selectedCandidats = $scope.getSelectedCandidats();
            for(var id in selectedCandidats) {
                var c = selectedCandidats[id];
                var v = $scope.getSkillsYear(c);
                var n = c.firstname + " " + c.lastname;
                data.series.push({
                    type: 'column',
                    name: n,
                    data: v
                })
            }

            var selectedJobs = $scope.getSelectedJobs();
            for(var id in selectedJobs) {
                var c = selectedJobs[id];
                var v = $scope.getSkillsYear(c);
                var n = c.name;
                data.series.push({
                    type: 'spline',
                    name: n,
                    data: v,
                    marker: {
                        lineWidth: 2
                    }
                })
            }


            var graph = new Highcharts.Chart(data);
            console.log(graph);


        }


    }]);






