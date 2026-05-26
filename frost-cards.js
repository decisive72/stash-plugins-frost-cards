(function () {
    const PluginApi = window.PluginApi;
    const React = PluginApi.React;
    const { Link } = PluginApi.libraries.ReactRouterDOM;
    const { FontAwesomeIcon } = PluginApi.libraries.ReactFontAwesome;
    const { faUser } = PluginApi.libraries.FontAwesomeSolid;

    PluginApi.patch.instead("SceneCard.Overlays", () => null);
    PluginApi.patch.instead("SceneCard.Popovers", () => null);
    PluginApi.patch.instead("SceneCard.Details", function (props, _, original) {
        const scene = props.scene;
        const studio = scene.studio ?? null;
        const date = scene.date ?? null;
        const description = scene.details ?? null;
        const performers = scene.performers;

        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { className: "frost-card__meta" },
                studio &&
                React.createElement(
                    Link,
                    { to: `/studios/${studio.id}`, className: "frost-card__studio" },
                    studio.name
                ),
                studio && date &&
                React.createElement("span", { className: "frost-card__meta-sep" }, "•"),
                date &&
                React.createElement("span", { className: "scene-card__date frost-card__date" }, date),
                (studio || date) && performers.length > 0 &&
                React.createElement("span", { className: "frost-card__meta-sep" }, "•"),
                performers.length > 0 &&
                React.createElement("span", { className: "frost-card__performers" },
                    React.createElement(FontAwesomeIcon, { icon: faUser, className: "fa-icon" }),
                    React.createElement("span", {}, performers.length)
                )
            ),
            original(props)
        );
    });
})();
