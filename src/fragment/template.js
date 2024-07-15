module.exports = (viewName) => {
    return `
<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
    <Dialog titleAlignment="center" title="Enhanced Fragment">
        <content>
            <VBox class="sapUiMediumMargin" alignItems="Center" justifyContent="SpaceAround" height="100%">
                <Text text="This Fragment connected with ${viewName}" textAlign="Center" />
                <Text text="Welcome to SAPUI5 Development!" textAlign="Center" />
                <Text text="Enjoy the coding journey!" textAlign="Center" />
                <Text text="We always help each other to contribute and grow together." textAlign="Center" />
                <Link text="Github Link: https://github.com/Open-Interface-Library/ui5-route-generator" href="https://github.com/Open-Interface-Library/ui5-route-generator" />
                <Text text="Quote of the day - The strong man is not the one who can overpower others, but the strong man is the one who controls himself when he is angry." textAlign="Center" />
            </VBox>
        </content>
        <beginButton>
            <Button text="OK" press="onCloseDialog" />
        </beginButton>
    </Dialog>
</core:FragmentDefinition>


`
}
