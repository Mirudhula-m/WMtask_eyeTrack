// messages to the subject for eye tracking
// includes instructions for calibration
// includes eye fixation training
var gazeMetric_initialIter;
var gazeMetric_finalIter;

var giveFB = 0;
var do_recal = 0;

var calibration_msg = 
{
	type: "html-keyboard-response",
	stimulus: "<p style = 'font-size:20px; color:black'>Press any key to "
			  +"begin eye tracking calibration.</p>",
};

var calibration = 
{
	type: "call-function",
	func: function()
	{
		GazeCloudAPI.StartEyeTracking();
	},
	on_start: function()
	{
		document.body.style.cursor = 'pointer';
	},
	on_finish: function()
	{
		console.log("calibration complete.");
	}
};

// pre-trial validation with feedback circle
var fix_valid_FB = 
{
	type: "html-keyboard-response",
	stimulus: function()
	{
		GazeCloudAPI.OnResult = PlotGaze_withFB;
		gazeMetric_initialIter = eyeIter;

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

		countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
		staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
		countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
		//------------------------------------------------------------------

		fixationDot();
		stim_str = s.toString();
		s.clear();
		return stim_str;
	},
	prompt: "<p style = 'font-size:27px; color:black'>Please fixate your eyes on the dot at the centre.</p>",
	trial_duration: 500,
	choices: jsPsych.NO_KEYS,
	on_finish: function(data)
	{
		gazeMetric_finalIter = eyeIter;

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		data.changeAngle = changeAngle;

		data.countCorrect = countCorrect;
		data.staircaseCorrect = staircaseCorrect;
		data.countNAN = countNAN;
		//------------------------------------------------------------------
	}
}

var loop_fix_FB = 
{
	timeline: [fix_valid_FB],
	loop_function: function()
	{	
		err_lim_x1 = win_x/2 - 80;
		err_lim_x2 = win_x/2 + 80;

		err_lim_y1 = win_y/2 - 80;
		err_lim_y2 = win_y/2 + 80;

		var sum_gazeX = 0;
		var sum_gazeY = 0;

		console.log("eyeeeee  "+gazeMetric_initialIter+" "+gazeMetric_finalIter);
		for(var validIter = gazeMetric_initialIter; validIter < gazeMetric_finalIter; validIter++)
		{
			sum_gazeX = sum_gazeX + gazeX[validIter];
			sum_gazeY = sum_gazeY + gazeY[validIter];
		}
		avg_gazeX = sum_gazeX/(gazeMetric_finalIter - gazeMetric_initialIter );
		avg_gazeY = sum_gazeY/(gazeMetric_finalIter - gazeMetric_initialIter);

		console.log("errx1: "+err_lim_x1);
		console.log("erry1: "+err_lim_y1);
		console.log("avgx1: "+avg_gazeX);
		console.log("avgy1: "+avg_gazeY);

		if(avg_gazeX >= err_lim_x1 && avg_gazeX <= err_lim_x2 && avg_gazeY >=err_lim_y1 && avg_gazeY <= err_lim_y2)
		{
			return false;
		}
		else if(do_recal == 5)
		{
			return false;
		}
		else
		{
			do_recal++;
			return true;
		}
	}
}

var cond_fix_FB = 
{
	timeline: [loop_fix_FB],
	conditional_function: function()
	{
		if(giveFB == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

var fix_valid_NFB = 
{
	type: "html-keyboard-response",
	stimulus: function()
	{
		GazeCloudAPI.OnResult = PlotGaze_woFB;
		gazeMetric_initialIter = eyeIter;

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

		countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
		staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
		countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
		//------------------------------------------------------------------

		fixationDot();
		stim_str = s.toString();
		s.clear();
		return stim_str;
	},
	trial_duration: 500,
	choices: jsPsych.NO_KEYS,
	on_finish: function(data)
	{
		gazeMetric_finalIter = eyeIter;

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		data.changeAngle = changeAngle;

		data.countCorrect = countCorrect;
		data.staircaseCorrect = staircaseCorrect;
		data.countNAN = countNAN;
		//------------------------------------------------------------------
	}
}

var clickRecal = 
{
	type: "html-keyboard-response",
	stimulus: function()
	{
		GazeCloudAPI.OnResult = PlotGaze_withFB;
		gazeMetric_initialIter = eyeIter;
		GazeCloudAPI.UseClickRecalibration = true; 
		document.body.style.cursor = 'pointer';

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		changeAngle = jsPsych.data.get().last(1).values()[0].changeAngle;

		countCorrect = jsPsych.data.get().last(1).values()[0].countCorrect;
		staircaseCorrect = jsPsych.data.get().last(1).values()[0].staircaseCorrect;
		countNAN = jsPsych.data.get().last(1).values()[0].countNAN;
		//------------------------------------------------------------------

		fixationDot();
		stim_str = s.toString();
		s.clear();
		return stim_str;
	},
	prompt: "<p style = 'font-size:27px; color:black'>Please fixate your eyes on the dot at the centre <strong>AND SIMULTANEOUSLY</strong> click on the dot at the centre <strong>till the circle covers the dot</strong>.</p>",
	trial_duration: 500,
	choices: jsPsych.NO_KEYS,
	on_finish: function(data)
	{
		gazeMetric_finalIter = eyeIter;

		GazeCloudAPI.UseClickRecalibration = false; 
		document.body.style.cursor = 'none';

		//------------------------------------------------------------------
		// PASS ON DATA
		//------------------------------------------------------------------
		data.changeAngle = changeAngle;

		data.countCorrect = countCorrect;
		data.staircaseCorrect = staircaseCorrect;
		data.countNAN = countNAN;
		//------------------------------------------------------------------
	}
}

var loop_recalibration = 
{
	timeline: [clickRecal],
	loop_function: function()
	{
		err_lim_x1 = win_x/2 - 50;
		err_lim_x2 = win_x/2 + 50;

		err_lim_y1 = win_y/2 - 50;
		err_lim_y2 = win_y/2 + 50;

		var sum_gazeX = 0;
		var sum_gazeY = 0;

		for(var validIter = gazeMetric_initialIter; validIter < gazeMetric_finalIter; validIter++)
		{
			sum_gazeX = sum_gazeX + gazeX[validIter];
			sum_gazeY = sum_gazeY + gazeY[validIter];
		}
		avg_gazeX = sum_gazeX/(gazeMetric_finalIter - gazeMetric_initialIter);
		avg_gazeY = sum_gazeY/(gazeMetric_finalIter - gazeMetric_initialIter);

		if(avg_gazeX >= err_lim_x1 && avg_gazeX <= err_lim_x2 && avg_gazeY >=err_lim_y1 && avg_gazeY <= err_lim_y2)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

var cond_recalibration = 
{
	timeline: [loop_recalibration],
	conditional_function: function()
	{
		if(do_recal == 5)
		{
			do_recal = 0;
			return true;
		}
		else
		{
			do_recal = 0;
			return false;
		}
	}
}

var loop_fixation = 
{
	timeline: [cond_fix_FB, cond_recalibration, fix_valid_NFB],
	loop_function: function()
	{	
		err_lim_x1 = win_x/2 - 80;
		err_lim_x2 = win_x/2 + 80;

		err_lim_y1 = win_y/2 - 80;
		err_lim_y2 = win_y/2 + 80;

		var sum_gazeX = 0;
		var sum_gazeY = 0;

		for(var validIter = gazeMetric_initialIter; validIter < gazeMetric_finalIter; validIter++)
		{
			sum_gazeX = sum_gazeX + gazeX[validIter];
			sum_gazeY = sum_gazeY + gazeY[validIter];
		}
		avg_gazeX = sum_gazeX/(gazeMetric_finalIter - gazeMetric_initialIter);
		avg_gazeY = sum_gazeY/(gazeMetric_finalIter - gazeMetric_initialIter);

		if(avg_gazeX >= err_lim_x1 && avg_gazeX <= err_lim_x2 && avg_gazeY >=err_lim_y1 && avg_gazeY <= err_lim_y2)
		{
			giveFB = 0;
			return false;
		}
		else
		{
			giveFB = 1;
			return true;
		}
	}
}
