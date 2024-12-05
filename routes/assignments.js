let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignmentss(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}

//pagination
function getAssignments(req, res){
    var aggregateQuery = Assignment.aggregate();
    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page)|| 1,
            limit: parseInt(req.query.limit)|| 10,
        },
        (err, assignments)=>{
            if(err){
                res.send(err);
            }
            res.send(assignments);
        }
    )
}


// Récupérer un assignment par son id (GET)
function getAssignmentNON(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}
  
// Ajout d'un assignment (POST)
function postAssignmentnon(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignmentnon(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}
// suppression d'un assignment (DELETE)
function deleteAssignmentNon(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}

// **********Mongose*********
// Modification
function updateAssignment(req, res) {
    console.log("UPDATE reçu assignment : ");
    console.log(req.body);

    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then(updatedAssignment => {
            if (!updatedAssignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }

            res.json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Error updating assignment', error: err });
        });
}
// supprimer un assignement
function deleteAssignment(req, res) {
    Assignment.findByIdAndDelete(req.params.id)
        .then(assignment => {
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }
            res.json({ message: `${assignment.nom} deleted` });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Error deleting assignment', error: err });
        });
    
}
// recuperer un assignement
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findOne({id: assignmentId })
      .then(assignment => {
        if (!assignment) {
          return res.status(404).send('Assignment not found');
        }
        res.send(assignment);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
  function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment);

    // Utilisation de la promesse retournée par save()
    assignment.save()
        .then(() => {
            res.json({ message: `${assignment.nom} saved!` });
        })
        .catch((err) => {
            res.status(500).send('Cant post assignment', err);
        });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
