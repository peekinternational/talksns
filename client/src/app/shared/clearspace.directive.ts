import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";

@Directive({
    selector: '[appclearspace]'
})

export class ClearspaceDirective {

    constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) { }

    @Input() set appclearspace(condition: boolean) {
        if (!condition) {
            this.vcRef.createEmbeddedView(this.templateRef);
        }
        else {
            this.vcRef.clear();
        }
    }


}