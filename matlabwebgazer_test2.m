%% Initialize system/experiment variables 
clear all

AssertOpenGL;
KbName('UnifyKeyNames');

% Setup key mapping:
esc=KbName('ESCAPE');
startKey=KbName('B');
startKey2=KbName('C');
% startKey=KbName('SPACE');
Device_ID = -1;

% subject ID to be typed e
% subj_id = input('Please enter subject ID:  ','s');

% set up nodejs in matlab
setupNodejs;
system('C:\Users\wuqy0\Documents\psy\Adolphs\Eyetracking\webgazertutorial-main\webgazertutorial-main-test\node app.js');
dos('start chrome http://localhost:2000');
%% Screen setup 
% input('Enter e to resume:', 's');
bWaiting2 = 1;
while bWaiting2
    [bKey_press, ~, key_code] = KbCheck(Device_ID);
    bWaiting2 = ~(bKey_press && key_code(startKey2));
 end
PsychDefaultSetup(2);
Screen('Preference', 'SkipSyncTests', 1);

% debug mode
PsychDebugWindowConfiguration(0, 0.5)

% Open onscreen window with gray background:
[win, ScreenRect] = Screen('OpenWindow',2,[127 127 127]);
%[win, ScreenRect] = Screen('OpenWindow',max(Screen('Screens')),[127 127 127]);

% Choose text size:
Screen('TextSize', win, 30);  

% Gets screen refresh rate
Screen('GetFlipInterval', win);

DrawFormattedText(win, 'Press B when you are ready to start.', 'center', 'center', [255 255 255], [], [], [], 2);
Screen('Flip',win);

% system('open ./experiment.html')


bWaiting = 1;
while bWaiting
    [bKey_press, ~, key_code] = KbCheck(Device_ID);
    bWaiting = ~(bKey_press && key_code(startKey));
end
    

DrawFormattedText(win, 'Great job!', 'center', 'center', [255 255 255], [], [], [], 2);
Screen('Flip', win);
WaitSecs(1);
    
Screen('CloseAll');
