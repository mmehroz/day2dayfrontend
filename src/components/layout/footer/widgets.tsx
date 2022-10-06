import Container from "@components/ui/container";
import WidgetLink from "@components/widgets/widget-link";
import Logo from "@components/ui/logo";

interface WidgetsProps {
  widgets: {
    id: number;
    widgetTitle: string;
    lists: any;
  }[];
}

const Widgets: React.FC<WidgetsProps> = ({ widgets }) => {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 md:gap-9 xl:gap-10  pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24 lg:mb-0.5 2xl:mb-0 3xl:-mb-1 pt-10 ">
        <Logo />

        {widgets?.map((widget) => (
          <WidgetLink
            key={`footer-widget--key${widget.id}`}
            data={widget}
            className="pb-3 md:pb-0 "
          />
        ))}
      </div>
    </Container>
  );
};

export default Widgets;
//
