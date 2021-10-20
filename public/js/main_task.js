/**************/
/** Constants */
/**************/
const nrating = 3;
const nchoices = 1;
const fixation_duration = 500;
const nprac = 3;
const nImageInst = 2;
const realCaliDot = 13;


var subject_id = jsPsych.randomization.randomID(7);

/** load all the images, and remember to preload before starting the experiment */
var exp_images = [];
for (var i = 0; i < nrating; i++) {
  exp_images.push('../img/FoodImages/foodStimulus_' + i + '.jpg');
}


/** load all the images, and remember to preload before starting the egitxperiment */
var instruct_img = [];
for (var i = 0; i < nImageInst; i++) {
  instruct_img.push('../img/instruct' + i + '.png');
}


var prac_img = [];
for (var i = 1; i <= 4; i++) {
  prac_img.push('../img/pracImg/foodprac_' + i + '.jpg');
}



var charity_choice_images = []; // one-d array
var charity_choice_images_zero = []
var charity_real_pairs;
var charity_prac_pairs;

var get_prac_images = function () {
  var allcom = Combinatorics.combination(prac_img, 2);
  var multi_choice_temp = []
  while (temp = allcom.next()) {
    multi_choice_temp.push(jsPsych.randomization.shuffle(temp));
  }
  return utils.getRandomSample(multi_choice_temp, 3);

};


const combinations = ([head, ...tail]) => tail.length > 0 ? [...tail.map(tailValue => [head, tailValue]), ...combinations(tail)] : []
var get_multichoice_images = function () {
  multi_choice_temp = combinations(charity_choice_images_zero);
  shuffled_multi_choice_temp = jsPsych.randomization.repeat(multi_choice_temp, 1);
  randsamples = jsPsych.randomization.sampleWithoutReplacement(shuffled_multi_choice_temp, 100);
  console.log(randsamples)
  return randsamples
}



function makeSurveyCode(status) {
  uploadSubjectStatus(status);
  var prefix = {'success': 'cg', 'failed': 'sb'}[status]
  return `${prefix}${subject_id}`;
}

function uploadSubjectStatus(status) {
  $.ajax({
    type: "POST",
    url: "/subject-status",
    data: JSON.stringify({subject_id, status}),
    contentType: "application/json"
  });
}



/***********************/
/******** Trials *******/
/***********************/


var start_exp_survey_trial = {
  type: 'survey-text',
  questions: [
    {prompt: "What's your worker ID?", rows: 2, columns:50 , required:true}, 
    {prompt: "What's your age?", rows: 1, columns: 50, required:true},
    {prompt: "What's your gender? (Female/Male)", rows: 1, columns: 50,require: true},
  ],
  preamble: `<div>Thanks for choosing our experiment! Please answer the following questions to begin today's study. </div>`,
};



/** full screen */
var fullscreenEnter = {
  type: 'fullscreen',
  message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
  This will help the study run more smoothly.    <br/>
   Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
   Finally, once the study has started, <b>DO NOT EXIT</b>fullscreen mode or you will terminate the study and not receive any payment. <br/>   
  <br><br/>
  The study will switch to full screen mode when you press the button below.  <br/>
  When you are ready to begin, press the button.</div>`,
  fullscreen_mode: true,
  on_finish: function () {
    document.body.style.cursor = 'none'
  }
};


var eyeTrackingInstruction1 = {
  type: 'html-keyboard-response',
  stimulus: `<div> <font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                             <br><br/>
                Before we begin with the study, we need to turn on and adjust your webcam for eye-tracking.   <br/>
                
                There are two parts to this process. The first part is calibration and the second part is validation.<br/>
                <br><br/>
                During calibration, you will see a series of dots like this <span id="calibration_dot_instruction"></span> appear on the screen, each for 3 seconds.<br/>
                Your task is simply to stare directly at each dot until it disappears.<br/>
                Then, quickly move your eyes to the next dot and repeat.<br/>
                <br><br/>
                Validation is basically the same as calibration. You simply need to stare at each dot until it turns <b><font color='green'>green</font></b> and disappears.<br/>
                During validation, the dot may turn <b><font color='yellow'>yellow</font></b>, indicating that you don’t seem to be staring directly at it.  <br/>
                Try to keep this from happening! 
                <br><br/>
                When you are ready, press the SPACE BAR to continue. </div>`,
  post_trial_gap: 500,
  choices: ['spacebar'],

}

var eyeTrackingInstruction2 = {
  type: 'html-keyboard-response',
  stimulus: `<div><font size=120%; font color = 'green';>Calibration & Validation </font><br/>
                                                                          <br><br/>
      When the calibration begins, you will see a video feed with your face at the top left corner of your screen like this:  <br/>
        <br><br/>
         <img height="220px" width="270px" src="${instruct_img[0]}"><br/>
       <br><br/>
                         Try to keep your entire face within the box. When your face is in a good position, the box will turn <b><font color='green'>green</font></b>. <br/>
                         <font size=5px; font color = 'red';> <b>NOTE</b>: the video feed only appears during calibration.</font><br/>
                         <br><br/>
                         <font size=5px; >When you are ready, press the  <b>SPACE BAR</b> to continue.</font>
              
                         </div>`,
  post_trial_gap: 500,
  choices: ['spacebar'],

}

var eyeTrackingNote = {

  type: 'html-keyboard-response',
  stimulus: `<div><font size=120%; font color = 'green';> Calibration & Validation</font><br/>
                                                                          <br><br/>
             <font size = 5px font color = "yellow">There are several <b>IMPORTANT</b> tips that are useful for passing the calibration task:<br/></font>
             <img height="200px" width="1000px" src="${instruct_img[1]}"><br/>
             <br><br/>
             <div style="text-align-last:left">
            In addition to the tips in the figure: <br/>
            (1). Use your eyes to look around the screen and try to avoid moving your head. <br/>
            (2). Try to keep lights in front of you rather than behind you so that the webcam can clearly see your face. Avoid sitting with a window behind you. <br/>
            (3). After you have made these adjustments, check again that your face fits nicely within the box on the video feed and that the box is green. <br/></div>
             <br><br/>
             <font size=5px; font color = 'red';> <b>NOTE</b>:  <br/>
            If you are back on this page, it means the calibration and validation did not work as well as we would like.  <br/>
            Please read the tips above again, make any adjustments, and try again.  <br/>
            There are only <b>THREE</b> chances to get this right.  <br/>
            Otherwise, the study cannot proceed and you will only receive 50 cents for participating.  </font><br/>
            <br><br/>
             <font size=5px; >When you are ready, press the <b>SPACE BAR</b> to bring up the video feed and make these adjustments. </font></div>`,
  post_trial_gap: 500,
  choices: ['spacebar'],

}


//eye tracking parameters
var calibrationMax = 3;
var calibrationAttempt = 0;
var success = false; //update if there's a success
var eye_calibration_state = {
  doInit: true
};

var init_flag = function () {
  if (calibrationAttempt == 0) {
    return true;
  } else return false;
};

var validationTols = [130, 165, 200];
// var validationAccuracys = [0.8, 0.7, 0.6];
var validationAccuracys = [0.6, 0.5, 0.4];

/** first we need a calibration and validation step before entering into the main choice task */
var inital_eye_calibration = {
  timeline: [
    eyeTrackingNote,
    {
      type: "eye-tracking",
      doInit: () => init_flag(),
      doCalibration: true,
      doValidation: true,
      calibrationDots:  realCaliDot , 
      calibrationDuration: 5, 
      doValidation: true,
      validationDots:  realCaliDot , 
      validationDuration: 2,
      validationTol: validationTols[calibrationAttempt],
      // showPoint: true,
      on_finish: function (data) {
        console.log(JSON.parse(data.validationPoints)[0].hitRatio == null);
       if(JSON.parse(data.validationPoints)[0].hitRatio == null) {
        jsPsych.endExperiment('The study has ended. You may have exited full screen mode, or your browser may not be compatible with our study.');
       } else {
        calibrationAttempt++;
        if (data.accuracy >= validationAccuracys[calibrationAttempt - 1]) success = true;
        if (!success && calibrationAttempt == calibrationMax) {
          survey_code = makeSurveyCode('failed');
          closeFullscreen();
          jsPsych.endExperiment(`Sorry, unfortunately the webcam calibration has failed.  We can't proceed with the study.  </br> You will receive 50 cents for making it this far. Your survey code is: ${survey_code}. Thank you for signing up!` );
        }
       }
      }
    }
  ],
  loop_function: () => (calibrationAttempt < calibrationMax) && (!success),
};



var prestart = {
  type: "html-keyboard-response",
//    on_start: () => ensureWebcam(),
  stimulus: `<div>Now we gonna collect your eye data
  <br></br>
  Press the <b>B</b> when you are ready to begin.
  <br></br>
  Press <b>P</b> when you want to pause.</div>`,
  choices: ['b'],
  post_trial_gap: null,
};


var showstim = {
    type: "binary-choice",
    stimulus:[exp_images[0],exp_images[1]],
    choices: ["P", "N"],
    doEyeTracking: true,
    post_trial_gap: null
}


var indicate_pause = {
  type: "html-keyboard-response",
  stimulus: `<div> Recording is paused
      <br></br>
      Press the SPACEBAR when you wannt finish.</div>`,
  choices:['spacebar'],
  post_trial_gap: 1000,
}

 var successExp = false
 var success_guard = {
   type: 'call-function',
   func: () => {successExp = true}
 }





/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}


var on_finish_callback = function () {
  
  
 // jsPsych.data.displayData();
  jsPsych.data.addProperties({
    browser_name: bowser.name,
    browser_type: bowser.version,
    subject: subject_id,
    interaction: jsPsych.data.getInteractionData().json(),
    //quiz: quiz_correct_count,
    screenWidth: screen.width,
    screenHight: screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  });
  // save data
  jsPsych.data.get().localSave('json', 'sample-data.json');
  var data = JSON.stringify(jsPsych.data.get().values());
  $.ajax({
      type: "POST",
      url: "/data",
      data: data,
      contentType: "application/json"
    })
    .done(function () {
      // alert("your data has been saved!")
    })
    .fail(function () {
      //alert("problem occured while writing data to box.");
    })
}

var trialcounter;




function startExperiment() {
  jsPsych.init({
    timeline: [
      start_exp_survey_trial,
      fullscreenEnter,
      eyeTrackingInstruction1 ,eyeTrackingInstruction2 , inital_eye_calibration ,
      prestart,
      showstim,
      indicate_pause,
      success_guard
    ],
    on_trial_finish: function () {
      trialcounter = jsPsych.data.get().count();
     if(successExp) {
      closeFullscreen()
      document.body.style.cursor = 'pointer'
      jsPsych.endExperiment(`<div>
      Thank you for your participation! You can close the browser to end the experiment now. </br>
                  The webcam will turn off when you close the browser. </br>
                    Your survey code is: ${makeSurveyCode('success')}. </br>
                   We will send you $7 as your participant fee soon! </br> 
      </div>`);
      }
      if (trialcounter == 40) {
        on_finish_callback();
        jsPsych.data.reset();
      }
    },
    preload_images: [exp_images, instruct_img,prac_img],
    on_finish: () => on_finish_callback(),
    on_close: () => on_finish_callback()

  });
};

