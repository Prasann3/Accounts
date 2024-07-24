const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
   alert(`This site contains accounts of for 4 usres.You can acces them by entering id and pin.
          1.Jonas(id=js)   : pin(1111).
          2.Jessica(id=jd) : pin(2222)
          3.Steven(id=stw) : pin(3333)
          4.Sarah(id=ss)   : pin(4444)`
          )
  const accounts = [account1, account2, account3, account4];
  let current_account=account1;
  let movements=document.querySelector('.movements');
  let balance__value=document.querySelector('.balance__value');
  let nav_welcome=document.querySelector('.welcome');
  let summary_valuein=document.querySelector('.summary__value--in');
  let summary_valueout=document.querySelector('.summary__value--out')
  let summary_valueintrest=document.querySelector('.summary__value--interest');
  let login_user=document.querySelector('.login__input--user');
  let login_pin=document.querySelector('.login__input--pin');
  let login_button=document.querySelector('.login__btn');
  let login__form=document.querySelector('.login');
  let main_app=document.querySelector('.app');
  let form_inputto=document.querySelector('.form__input--to');
  let form_inputamount=document.querySelector('.form__input--amount');
  let transfer_btn=document.querySelector('.form__btn--transfer');
  let form_close_user=document.querySelector('.form__input--user');
  let form_close_pin=document.querySelector('.form__input--pin');
  let close_button=document.querySelector('.form__btn--close');
  let loan_button=document.querySelector('.form__btn--loan');
  let sort_button=document.querySelector('.btn--sort');
  accounts.forEach(function(accs){
      let name=accs.owner.toLowerCase();
      let usser_name=name.split(" ").map((user)=>user[0]).join("");
      accs.username=usser_name;
  });
  let diplay_movements=function(ar,sorted=false){
    let arr=sorted ? ar.slice().sort((a,b)=>a-b) : ar;
    movements.innerHTML="";
   arr.forEach(function(val,i){
      let type=(val>0)? "deposit" : "withdrawal";
      let html= ` <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${val}€</div>
    </div> `;
      movements.insertAdjacentHTML('afterbegin',html);
     
   });
  }
  let current_balance=function(){
    let curr_balance=current_account.movements.reduce(function(accs,val){
        return accs+val;
     },0);
     balance__value.textContent=`${curr_balance} €`;
     nav_welcome.textContent=`Welcome, ${current_account.owner.split(' ')[0]}`;
  }
  let summary__value=function(){
    let total_in=current_account.
      movements.filter((val)=>val>0).reduce((acs,val)=>acs+val,0);
     summary_valuein.textContent=total_in+"€";

     let total_out=current_account.
      movements.filter((val)=>val<0).reduce((acs,val)=>acs+val,0);
     summary_valueout.textContent=Math.abs(total_out)+"€";

     let total_int=current_account.movements.
                   filter((val)=>val>0)
                   .map((val)=>val*(current_account.interestRate)/100)
                   .reduce((acs,val)=>acs+val,0);
    summary_valueintrest.textContent=total_int+"€";

  
  }
  login_button.addEventListener('click',function(e){
              e.preventDefault();
              let user=login_user.value;
              let pin =Number(login_pin.value);
              let account=accounts.find((acn)=>acn.username===user);
              if(account && account.pin===pin){
               main_app.style.opacity=1; 
               current_account=account;
              }
              
               login_user.value="";
               login_pin.value="";
               login_pin.blur();
                diplay_movements(current_account.movements);
                current_balance();
                summary__value();
  });

  transfer_btn.addEventListener('click',function(e){
     e.preventDefault();
     const user_to=form_inputto.value;
     const amount=Number(form_inputamount.value);
     const to_account=accounts.find((acc)=>acc.username===user_to);
     form_inputto.value="";
     form_inputamount.value="";
     if(to_account && amount>0 && amount<=Number(balance__value.textContent.split(" ")[0])){
            
            current_account.movements.push(Number(-amount));
            to_account.movements.push(Number(amount));
            let curr_balance=Number(document.querySelector('.balance__value').textContent.split(" ")[0]);
            curr_balance-=amount;
            document.querySelector('.balance__value').textContent=`${curr_balance} €`;
            const html=`<div class="movements__row">
          <div class="movements__type movements__type--withdrawal">${current_account.movements.length} withdrawal</div>
          <div class="movements__date"></div>
          <div class="movements__value">${amount} €</div>
        </div>`;
          movements.insertAdjacentHTML('afterbegin',html);
          
     }
     else alert("Either the user doesnot exist or amount value is not correct")
  });

  close_button.addEventListener('click',function(e){
     console.log(close_button);
      e.preventDefault();
      const close_username=form_close_user.value;
      console.log(close_username);
      const close_pin=Number(form_close_pin.value);
      console.log(close_pin);
      const account_close_index=accounts.findIndex((acc)=> acc.username==close_username);
      console.log(account_close_index);
      if(account_close_index!= -1 &&
         accounts[account_close_index].pin===close_pin &&
         current_account.pin===close_pin
      ){
        
        accounts.splice(account_close_index,1);
        main_app.style.opacity=0;
      }
  })

loan_button.addEventListener('click',function(e){
  e.preventDefault();
  const loan_amount=Number(document.querySelector('.form__input--loan-amount').value);
  const can_give=current_account.movements.some((mov)=> loan_amount/10 <=mov);
  if(can_give){
     current_account.movements.push(loan_amount);
     let curr_balance=Number(document.querySelector('.balance__value').textContent.split(" ")[0]);
     curr_balance+=loan_amount;
     document.querySelector('.balance__value').textContent=`${curr_balance} €`;

     const html=`<div class="movements__row">
     <div class="movements__type movements__type--deposit">${current_account.movements.length} deposit</div>
     <div class="movements__date"></div>
     <div class="movements__value">${loan_amount} €</div>
   </div>`;
     movements.insertAdjacentHTML('afterbegin',html);
     document.querySelector('.form__input--loan-amount').value="";
  }
});
let sort=true;
sort_button.addEventListener('click',function(e){
   e.preventDefault();
   diplay_movements(current_account.movements,sort);
   sort=!sort;

})


