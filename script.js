const fetchBtn = document.querySelector("#fetch-btn");
const userName = document.querySelector(".username");
fetchBtn.addEventListener('click',getRepos);

function getRepos() {
    let regex = new RegExp(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i);//github username regex
    let error = document.querySelector(".error-msg");
    if(regex.test(userName.value)){
        fetch(`https://api.github.com/users/${userName.value}/repos`)
        .then(function(response) {
            if(response.status == 404) {
                error.style.display = "block";
                let table = document.querySelector("#data-table");
                let filterInput = document.querySelector(".table-filter")
                table.style.display = "none";
                filterInput.style.display = "none";
            } else {
                error.style.display = "none";
            }
            return response.json()
        })
        .then(function(result) {
            if(result.length !== 0 && result.message!=="Not Found"){
                appendTableRows(result);
                let table = document.querySelector("#data-table");
                makeSortable(table);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    } else {
        error.style.display = "block";
        let table = document.querySelector("#data-table");
        let filterInput = document.querySelector(".table-filter")
        table.style.display = "none";
        filterInput.style.display = "none";
    }
};

function appendTableRows(apidata) {
    let table = document.querySelector("#data-table");
    let filterInput = document.querySelector(".table-filter")
    let tableBody = document.querySelector(".table-body");
    tableBody.remove();
    let new_tbody = document.createElement('tbody');
    new_tbody.classList.add("table-body");
    table.appendChild(new_tbody)
    apidata.forEach(function(data){
        let userimage = document.createElement("IMG");
        userimage.src = data.owner.avatar_url;
        userimage.classList.add("username");
        let row = new_tbody.insertRow(-1);
        let ownerCell = row.insertCell(0);
        let nameCell = row.insertCell(1);
        let descriptionCell = row.insertCell(2);
        let starsCell = row.insertCell(3);
        let issuesCell = row.insertCell(4);
        let watchersCell = row.insertCell(5);
        ownerCell.innerHTML = `<div class="firstCell"><img src=${data.owner.avatar_url} class="userimage" alt="userimage">${data.owner.login}</div>`;
        nameCell.innerHTML = data.name;
        descriptionCell.innerHTML = data.description !== null && data.description.length>20 ? data.description.substring(0,20)+"..." : data.description;
        starsCell.innerHTML = data.stargazers_count;
        issuesCell.innerHTML = data.open_issues;
        watchersCell.innerHTML = data.watchers;
    });
    table.style.display = "block";
    filterInput.style.display = "block";
}

(function() {
const TableFilter = (function() {
 let Arr = Array.prototype;
		let input;
  
		function onInputEvent(e) {
			input = e.target;
			let table1 = document.getElementsByClassName(input.getAttribute('data-table'));
			Arr.forEach.call(table1, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, filter);
				});
			});
		}

		function filter(row) {
			let text = row.textContent.toLowerCase();
			let val = input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				let inputs = document.getElementsByClassName('table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = onInputEvent;
				});
			}
		};
 
	})();
 TableFilter.init(); 
})();


function sortTable(table, col, reverse) {
    let tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
        return reverse // `-1 *` if want opposite order
            * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                .localeCompare(b.cells[col].textContent.trim())
               );
    });
    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}

function makeSortable(table) {
    let headers = table.tHead, i;
    headers && (headers = headers.rows[0]) && (headers = headers.cells);
    if (headers) i = headers.length;
    else return; // if no `<thead>` then do nothing
    while (--i >= 0) (function (i) {
        let dir = 1;
        headers[i].addEventListener('click', function () {
            if (headers[i].childNodes[1].classList.contains('arrow-up')){
                headers[i].childNodes[1].classList.remove('arrow-up');
                headers[i].childNodes[1].classList.add('arrow-down');
            } else {
                headers[i].childNodes[1].classList.remove('arrow-down');
                headers[i].childNodes[1].classList.add('arrow-up');
            }
            sortTable(table, i, (dir = 1 - dir))});
    }(i));
}