import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryTab from "./component/CategoryTab";

export default function ProductConfig() {
  return (
    <Tabs defaultValue="category" className="w-full">
      {/* Tabs Header */}
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
      </TabsList>

      <div className=" relative">
        {/* Tabs Content */}
        <TabsContent value="overview">
          <div>Overview Content</div>
        </TabsContent>

        <TabsContent value="analytics">
          <div>Analytics Content</div>
        </TabsContent>

        <TabsContent value="category">
          <CategoryTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
