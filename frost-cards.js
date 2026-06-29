(function () {
    const PluginApi = window.PluginApi;
    const React = PluginApi.React;
    const { Link } = PluginApi.libraries.ReactRouterDOM;
    const { FontAwesomeIcon } = PluginApi.libraries.ReactFontAwesome;
    const { FormattedMessage } = PluginApi.libraries.Intl;
    const { faTag, faUser } = PluginApi.libraries.FontAwesomeSolid;

    function getSceneNumber(scene, fromGroupId) {
        if (!fromGroupId) return undefined;
        const group = scene.groups.find((g) => g.group.id === fromGroupId);
        return group?.scene_index ?? undefined;
    }

    PluginApi.patch.instead("SceneCard.Overlays", () => null);
    PluginApi.patch.instead("SceneCard.Popovers", () => null);
    PluginApi.patch.instead("SceneCard.Details", function (props, _, original) {
        const scene = props.scene;
        const studio = scene.studio ?? null;
        const date = scene.date ?? null;
        const description = scene.details ?? null;
        const performers = scene.performers;
        const tags = scene.tags;

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
                    React.createElement(FontAwesomeIcon, { icon: faUser, className: "frost-card__icon" }),
                    React.createElement("span", {}, performers.length)
                ),
                (studio || date || performers.length > 0) && tags.length > 0 &&
                React.createElement("span", { className: "frost-card__meta-sep" }, "•"),
                tags.length > 0 &&
                React.createElement("span", { className: "frost-card__tags" },
                    React.createElement(FontAwesomeIcon, { icon: faTag, className: "frost-card__icon" }),
                    React.createElement("span", {}, tags.length)
                )
            ),
            original(props)
        );
    });
    PluginApi.patch.instead("SceneCard", function (props, _, original) {
        const rendered = original(props);

        const sceneNumber = getSceneNumber(props.scene, props.fromGroupId);

        if (!sceneNumber) {
            return rendered;
        }

        const sceneNumberLine = React.createElement(
            "span",
            { className: "scene-group-scene-number" },
            React.createElement(
                FormattedMessage,
                { id: "scene" }
            ),
            ` #${sceneNumber}`
        );

        return React.cloneElement(rendered, {
            pretitleIcon: sceneNumberLine,
        });
    });
})();
