$('#login-form').submit(function (e) {
	e.preventDefault();
	$.ajax({
		url: '/post/login',
		method: 'POST',
		cache: false,
		data: $('#login-form').serialize(),
		success: function (response) {
			if (response.status == 200) {
				alert(response.data);
				window.location.href = '/dashboard';
				return false;
			} else if (response.status == 422) {
				const errorMsg = response.error[0].msg;
				if (errorMsg) {
					alert(errorMsg);
				} else {
					alert(response.error);
				}
			}
		},
	});
});

$('#register-form').submit(function (e) {
	let firstName = $.trim($('#firstName').val());
	let lastName = $.trim($('#lastName').val());
	let email = $.trim($('#email').val());
	let mobileNo = $.trim($('#mobileNo').val());
	let country = $.trim($('#country').val());
	let state = $.trim($('#state').val());
	let city = $.trim($('#city').val());
	let hobbies = $.trim($('#hobbies').val());
	let dob = $.trim($('#dob').val());
	let password = $.trim($('#password').val());
	let confirmPassword = $.trim($('#confirmPassword').val());
	let image = $.trim($('#image').val());
	let passwordFilter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&_-])[A-Za-z\d@$.!%*#?&_-]{8,}$/;
	let nameFilter = /^[a-zA-Z '.-]*$/;
	let mobileFilter = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	let emailFilter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (firstName == '') {
		alert('First name is required');
		return false;
	} else if (!nameFilter.test(firstName)) {
		alert('Please enter valid first name');
		return false;
	} else if (lastName == '') {
		alert('Last name is required');
		return false;
	} else if (!nameFilter.test(lastName)) {
		alert('Please enter valid last name');
		return false;
	} else if (email == '') {
		alert('Email is required');
		return false;
	} else if (!emailFilter.test(email)) {
		alert('Please enter valid email');
		return false;
	} else if (mobileNo == '') {
		alert('Mobile number is required');
		return false;
	} else if (!mobileFilter.test(mobileNo)) {
		alert('Please enter valid mobile number');
		return false;
	} else if (password == '') {
		alert('Password is required');
		return false;
	} else if (confirmPassword == '') {
		alert('Confirm password is required');
		return false;
	} else if (!passwordFilter.test(password)) {
		alert(
			'Password must be at least 5 characters, at least one letter, one number and one special character'
		);
		return false;
	} else if (password !== confirmPassword) {
		alert("Password does'nt match");
		return false;
	} else if ($('input[name="gender"]:checked').length == 0) {
		alert('Please select gender');
		return false;
	} else if (country == '') {
		alert('Please select country');
		return false;
	} else if (state == '') {
		alert('Please select state');
		return false;
	} else if (city == '') {
		alert('Please select city');
		return false;
	} else if (dob == '') {
		alert('Dob is required');
		return false;
	} else if ($('input[type=checkbox]:checked').length == 0) {
		alert('Please select atleast one hobby');
		return false;
	} else if (image == '') {
		alert('Please select one image');
		return false;
	} else {
		e.preventDefault();
		var formData = new FormData(this);
		$.ajax({
			url: '/post/register',
			method: 'POST',
			cache: false,
			contentType: false,
			processData: false,
			data: formData,
			success: function (response) {
				if (response.status == 200) {
					alert(response.data);
					window.location.href = '/';
					return false;
				} else if (response.status == 422) {
					alert(response.error);
				}
			},
		});
	}
});

var interval;

function timer(id) {
	$(function () {
		var count = 10;
		interval = setInterval(function () {
			$('#count').html(count);
			count--;
			if (count === -1) {
				clearInterval(interval);
				alert("You're out of time!");
				$.ajax({
					url: '/post/answer',
					method: 'POST',
					cache: false,
					data: {
						page: $('#page').val(),
						question: $('#question').html(),
						userAnswer: $('#ans:checked').val(),
						marks: $('#count').text(),
						id: $('#quizID').val(),
						correctAnswer: $('#correctAnswer').val(),
						activeFlag: 1,
					},
					success: function (response) {
						if (response.status == 200) {
							if (response.pageNo >= 11) {
								alert('Quiz submitted successfully...');
								window.location.href = '/thankyou/' + response.quizID;
								return false;
							} else {
								startTimer();
								$('#question').html(response.data[0].question);
								let output = '';
								for (
									let i = 0;
									i < response.data[0].option.length;
									i++
								) {
									output += `<input type="radio" name="ans" id="ans" value="${response.data[0].option[i]}" required>
                                             <label for="${response.data[0].option[i]}">${response.data[0].option[i]}</label><br>`;
								}
								output += `<input type="hidden" id="correctAnswer" name="correctAnswer" value="${response.data[0].correctAnswer}">`;
								$('#option').html(output);
								$('#page').val(response.pageNo);
								return false;
							}
						} else if (response.status == 400) {
							alert(response.data);
						}
					},
				});
			}
		}, 1000);
	});
}

function startTimer() {
	timer();
}
function stopTimer() {
	clearInterval(interval);
}

$('#quizSubmit').submit(function (e) {
	stopTimer();
	let page = 1;
	e.preventDefault();
	$.ajax({
		url: '/post/answer',
		method: 'POST',
		cache: false,
		data: {
			page: $('#page').val(),
			question: $('#question').html(),
			userAnswer: $('#ans:checked').val(),
			marks: $('#count').text(),
			id: $('#quizID').val(),
			correctAnswer: $('#correctAnswer').val(),
			activeFlag: 1,
		},
		success: function (response) {
			if (response.status == 200) {
				if (response.pageNo >= 11) {
					alert('Quiz submitted successfully...');
					window.location.href = '/thankyou/' + response.quizID;
					return false;
				} else {
					startTimer();
					$('#question').html(response.data[0].question);
					let output = '';
					for (let i = 0; i < response.data[0].option.length; i++) {
						output += `<input type="radio" name="ans" id="ans" value="${response.data[0].option[i]}" required>
                              <label for="${response.data[0].option[i]}">${response.data[0].option[i]}</label><br>`;
					}
					output += `<input type="hidden" id="correctAnswer" name="correctAnswer" value="${response.data[0].correctAnswer}">`;
					$('#option').html(output);
					$('#page').val(response.pageNo);
					return false;
				}
			} else if (response.status == 400) {
				alert(response.data);
			}
		},
	});
});

function startQuiz() {
	$.ajax({
		url: '/post/startQuiz',
		method: 'POST',
		cache: false,
		data: {
			activeFlag: 0,
		},
		success: function (response) {
			if (response.status == 200) {
				startTimer();
				$('#quizID').val(response.id);
				$('#question').html(response.data[0].question);
				let output = '';
				for (let i = 0; i < response.data[0].option.length; i++) {
					output += `<input type="radio" name="ans" id="ans" value="${response.data[0].option[i]}" required>
                              <label for="${response.data[0].option[i]}">${response.data[0].option[i]}</label><br>`;
				}
				output += `<input type="hidden" id="correctAnswer" name="correctAnswer" value="${response.data[0].correctAnswer}">`;
				$('#option').html(output);
				$('.counter').show();
				$('.submit-button').show();
				$('#page').val(response.pageNo);
				return false;
			} else if (response.status == 400) {
				alert(response.data);
			}
		},
	});
}
