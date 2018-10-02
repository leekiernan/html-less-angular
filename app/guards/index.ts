declare const document:any;

export { ActivateGuard } from './activate.guard';
export { ConfirmationGuard } from './confirmation.guard';
export { CoverGuard } from './cover.guard';
export { DeactivateGuard } from './deactivate.guard';
export { PaymentGuard } from './payment.guard';


function getDotSyntax(form) {
  let res = [];
  const recurse = (data, current = "") => {
    for (var key in data) {
      var value = data[key];
      var newKey = (current ? current + "." + key : key);

      res.push(newKey);
      if (value && typeof value === "object") {
        recurse(value, newKey);
      }
    }
  }

  recurse(form.value);
  return res;
}

//
export function MarkFormErrors(form:any, prefix?:string) {
  // Convert this form into an array of strings that we can form.get; angular uses form.get('details.pets.1.name')
  // Each item, check if errors - mark as dirty and invalid in the form object.
  // Only perform if on-page *ngIf removes elements from the source
  getDotSyntax(form).forEach((field:string) => {
    const ctrl = form.get(field);

    if (ctrl && ctrl.errors && document.getElementById(prefix ? `${prefix}.${field}` : field)) {
      ctrl.markAsDirty();
      ctrl.updateValueAndValidity();
    }
  });
}

// Look at page for any invalid classes
// applied in components/form if marked as invalid above.
export function GetOnpageErrors() {
  return new Promise((resolve:any, reject:any) => {
    setTimeout(() => {
      let err:any = document.querySelector('.has-danger');
      !!err ? resolve(err) : reject('No errors');
    }, 250);
  });
}

// This works to dot-syntaxify
export function Iterate(root, filter = '', stack = '') {
  if (!root.controls) { return stack; }

  return Object.keys(root.controls)
    .filter( ctrl => ctrl !== filter )
    .map( ctrl => Iterate(root.get(ctrl), filter, stack ? `${stack}.${ctrl}` : ctrl))
    .reduce( (a, b) => a.concat(b), []);
}
