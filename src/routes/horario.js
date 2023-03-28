const express = require("express");
const router = express.Router();
const Activity = require('../models/activity')
const Subject = require('../models/subject')
const { loginRequired } = require("../controllers/auth");
const { DateTime } = require("luxon");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function(hours) {
    var date = new Date(this.valueOf());
    date.setDate(date.getHours() + hours);
    return date;
}

router.post('/create/:year/:month/:day', loginRequired , async (req, res, next) => {
    const user = await User.findById(session["userId"]);
    const subjectsList = await Subject.find({ user });// habria que ordenar por creditos
    const activitiesList = await Activity.find({ user });

    const paramMonth = params.month;
    const paramYear= params.year;
    const paramDay = params.day;
    let horario = user.horario_libre;
    let diasbloques;

    let monday = DateTime.now().set({ year: paramYear, month: paramMonth, day: paramDay});

    //adaptar el horario al de esa semana
    for(i in horario){
        let dia = monday.plus({days: i}).toJSDate();
        let hourinicio = horario[i].inicio.getHours();
        let minuteinicio = horario[i].inicio.getminutes();
        let hourfin = horario[i].fin.getHours();
        let minutefin= horario[i].fin.getminutes();
        horario[i].inicio = dia.setHours(hourinicio).setMinutes(minuteinicio);
        horario[i].fin = dia.setHours(hourfin).setMinutes(minutefin);
    }


    //dividir los dias en bloques
    for(i in horario){
        activitiesList.forEach((activity)=>{
            if(activity.inicio < horario[i].fin && activity.fin > horario[i].inicio){
                if(activity.inicio <= horario[i].inicio){
                    horario[i].inicio = activity.fin;
                }else if(activity.fin >= horario[i].fin){
                    horario[i].fin = activity.inicio;
                }else{
                    diasbloques[i].push({
                        inicio: horario[i].inicio,
                        fin: activity.inicio
                    });
                    horario[i].inicio = activity.fin;
                }
            }
        })
        if(horario[i].inicio < horaio[i].fin){
            diasbloques[i].push({
                inicio: horario[i].inicio,
                fin: horaio[i].fin
            });
        }
    }


   //se iteran las asignaturas hasta que no quepan mas o todos los creditos han sido encajados
    subjectsList.forEach(async ({creditos,color,_id,titulo})=>{
        let c = creditos;
        
        let dia = 0;
        let cabe = 0;

        while( c >= 0 && cabe < 2){
            
            let listabloques = diasbloques[dia];

            let encajao = false;
            for(let i = 0; i < listabloques.size() && !encajao; i++){//se iteran los bloques del dia en cuestion
                if(listabloques[i].inicio.addHours(1) <= listabloques[i].fin){//la asignatura cabe en el bloque
                    await Activity.create({ //se crea la asignatura
                        user: user._id,
                        titulo: "Estudiar " + titulo,
                        inicio: listabloques[i].inicio,
                        fin: listabloques[i].inicio.addHours(1),
                        color,
                        asigantura: _id,
                    });
                    listabloques[i].inicio = listabloques[i].inicio.addHours(1); //se reduce el bloque
                    c--; //se resta credito
                }
            }
            

            if(dia == 6){
                dia = 0;
                cabe ++;
            }else{
                dia++;
            }
        }
    })
});
  

module.exports = router;