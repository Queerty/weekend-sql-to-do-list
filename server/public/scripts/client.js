
$( document ).ready( function(){
    console.log( 'JQ' );
    // Establish Click Listeners
    setupClickListeners()
    //load tasks from database
    getTasks();
    clearInput();
    //status listener
    $('table').on('click', '#checkbox', changeStatusHandler);
    //delete listener
    $('#viewTasks').on('click', 'button#deleteButton', deleteTaskHandler);

}); // end doc ready

function setupClickListeners(){
    $( '#submitTask' ).on('click', function(){
        console.log( 'in submitTask on click');
        //validate inputs
        if(!$('#toDoItem').val()){
        console.log('add all inputs');
          return;
        }

        let taskToSend = {
            task: $('#toDoItem').val()
        };

        addTask( taskToSend );
        clearInput();
    })
}

//POST Ajax call
function addTask( taskToSend ){
    console.log('in addTask', taskToSend);

    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: taskToSend,
    }).then( response => {
        clearInput();
        getTasks();
    })
}

function clearInput(){
    $('#toDoItem').val('');
}


function getTasks(){
    console.log('in getTasks');
    //ajax call to server to get tasks
    //clear table before each display
$('#viewTasks').empty();

$.ajax({
    type: 'GET',
    url: '/tasks',
}).then(function (response){
    console.log('in getTasks', response);
    //append Tasks to DOM
    renderTaskInfo(response)
}).catch(error => {
    console.log('error rendering tasks', error);   
})

}; //end getTasks

function renderTaskInfo(response){
    for (let i=0; i<response.length; i++){
        if(response[i].status == 'Done'){
            $('#viewTasks').append(`
            <tr>
                <td id="check" style="font-size:32px">✓</td>
                <td id="done">${response[i].task}</td>
                <td></td>
                <td></td>
                <td>
                <button id="deleteButton" data-id="${response[i].id}" 
                data-task="${response[i].task}">delete
                </button></td>

            </tr>`)
        }else {
         $('#viewTasks').append(`
        <tr id="incomplete">
            <td id="check">
            <input type="checkbox" id="checkbox" data-id="${response[i].id}"> 
            </td>
            <td>${response[i].task}</td>
            <td></td>
            <td></td>
            <td>
            <button id="deleteButton" data-id="${response[i].id}" data-task="${response[i].task}">
            delete
            </button></td>
        //     </tr>`)
    }
}
};//end render

//DELETE Handler
function deleteTaskHandler(){
    deleteTask($(this).data('id'));

}//end delete handler

//DELETE
function deleteTask(taskId) {
    $.ajax({
      method: 'DELETE',
      url: `/tasks/${taskId}`
    })
    .then(response => {
      console.log(`Nevermind, I'm not doing this task`);
      getTasks(); // function to GET and display tasks
    })
    .catch((error) => {
      alert(`There was a problem deleting ${taskId}. Please try again.`);
    });
  }

  function changeStatusHandler(){
      changeStatus($(this).data('id'));
  }


  //put function to update status
  function changeStatus(taskId){
      $.ajax({
          method: 'PUT',
          url: `/tasks/${taskId}`
      })
      .then((response)=>{
          console.log('Task status change:', response);
          getTasks(); //update display
      }).catch (error => {
          alert('Something went wrong', error);
      });
    };