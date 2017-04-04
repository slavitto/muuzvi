$(function(){

    var ul = $('#upload ul'),
		i = 0,
		f1 = 'audio/mp3',
		f2 = 'audio/wma',
		f3 = 'audio/wav',
		msg = 'Only .mp3, .wma or .wav accepted',
		fmax = 50000000,
		maxmsg = 'Maximum file size is 50MB',
		src,
		snd_file,
		img_file;
		
	$('#drop').bind('dragover dragleave drop', drag);
	$(document).bind('fileuploaddone', upl_action);
	//document.addEventListener('upl_sound', upl_action, false);
	
	$('#template').click(function() { create_video('trend.mp3', 'uk_champ.jpg'); })

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {
            
            // Выводим сообщения о допустимых типах файлов и превышении размера файла
			var ftype = data.files[0]['type'];
            if(ftype != f1 && ftype != f2 && ftype != f3){ $('#desc').css({ 'color':'red' }).html(msg); return; }
			if(data.files[0].size > fmax) { $('#desc').css({ 'color':'red' }).html(maxmsg); return; }
			f1 === 'image/jpeg' ? src = 'uploads/' + data.files[0].name : src = 'assets/img/audio.gif';
			
            var tpl = $('<li class="working"><div id = "thumb' + i + '"></div><input type="text" value="0" data-width="48" data-height="48"'+
                ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

            // Append the file name and file size
            tpl.find('p').text(data.files[0].name).append('<i>' + formatFileSize(data.files[0].size) + '</i>');
			
			// Define soound file name
			if (i < 1) snd_file = data.files[0].name;

            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);
			 

            // Initialize the knob plugin
            tpl.find('input').knob();

            // Listen for clicks on the cancel icon
            tpl.find('span').click(function(){

                if(tpl.hasClass('working')){
                    jqXHR.abort();
                }

                tpl.fadeOut(function(){
                    tpl.remove();
                });

            });

            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();           
            
            },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if(progress == 100){
				data.context.removeClass('working');
				if(i > 0) {
					img_file = data.files[0].name;
					create_video(snd_file, img_file);
				}
            }
        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

	
	function drag(e) {
		if(e.type == 'dragover') drop.style.backgroundColor = '#EEE';	
		if(e.type == 'dragleave' || e.type == 'drop') drop.style.backgroundColor = '#F9F9F9';	
	}
	
	function upl_action(e) { 
		$('#thumb' + i).html('<img src="' + src + '" style="height:54px; width: auto; float: right; margin: 0 50px">');
		$('#drop_text').animate({ opacity: 0.0}, 500, () => $('#drop_text').text('Drop IMAGE here').animate({ opacity: 1.0}, 500));
		if(i === 0) $('#drop').slideUp(300).slideDown();
		$('#desc').text('JPG, PNG or GIF').css({ 'color':'#BBB' });
		$('#upl_ico').attr('src', '/assets/img/img_ico.png');
		$('#template').text('or Use Visualisation').prop('onclick',null).off('click').click(() => create_video(snd_file, 'visualization'));
		f1 = 'image/jpeg';
		f2 = 'image/png';
		f3 = 'image/gif';
		msg = 'Only .jpeg, .png or .gif accepted';
		fmax = 5000000;
		maxmsg = 'Maximum file size is 5MB';
		i++;
	}	
	
	function create_video(snd_file, img_file) {
		document.removeEventListener('upl_sound', false);
		$('#drop').css({'visibility':'hidden'});
		$('#template, #or').remove();
		console.log(img_file);
		if(img_file !== 'visualization') $('#drop_text').html('<div id="video">Make VIDEO</div>');
		$('#drop a').text('CREATE MUUZVI').prop('onclick',null).off('click').attr('id', 'create');
		$('#desc').text(snd_file + ', ' + img_file);		
		$('#drop').slideUp(300, () => $('#drop').css({'visibility':'visible'})).slideDown();
/* 		$('body').animate({width:'toggle'},1000); */
		$('#create, #video').click(function(e) {
		$('#drop').html('<img src="assets/img/working.gif">');
		if(e.target.id == 'create') img_file = 'visualization';
			$.post(
			"create.php",
			{
				snd_file: snd_file,
				img_file: img_file
			}, function(data) {
				if(data != 'err') {
					$('#drop').animate({ opacity: 0.0}, 500, () => $('#drop').html(`<video src="/output/${data.substring(7)}" width="480" height="270" controls><br><a id="download" href="/output/${data.substring(7)}">Download video</a>`).animate({ opacity: 1.0}, 500));
				} else { 
					$('#drop').html('Something gone wrong. Please <u id="again">try again</u>.');
					$('#again').css('cursor','pointer').click(function() { location.reload() });
				}
			});
		});
	}
	
});

// $(document).ready(function() {
  // $.ajaxSetup({ cache: true });
  // $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    // FB.init({
      // appId: '443224036023211',
      // version: 'v2.7' // or v2.1, v2.2, v2.3, ...
    // });     
    // $('#loginbutton,#feedbutton').removeAttr('disabled');
    // FB.getLoginStatus(updateStatusCallback);
  // });
  (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=443224036023211";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// });