import {
  OrderSelectType,
  LineItemSelectType,
  LocationSelectType,
} from "@/lib/db/schema";
import { format } from "date-fns";
import { styles } from "./styles";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

interface OrderInvoiceProps {
  data: OrderSelectType & {
    lineItems: LineItemSelectType[];
    location: LocationSelectType | null;
  };
}

export const PackingSlip = ({ data }: OrderInvoiceProps) => {
  return (
    <Document title={`Packing Slip - ${data.id}`}>
      <Page size="A4" style={[styles.page]}>
        {/* HEADER SECTION */}
        <View fixed>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={styles.logo}
              />
              <View>
                <View style={styles.headerContactText}>
                  <Text>
                    {data.location?.address?.street}
                    {data.location?.address?.city}
                  </Text>
                  <Text>
                    {data.location?.address?.state}
                    {data.location?.address?.zip}
                  </Text>
                  <Text>Phone: {data.location?.phone}</Text>
                  <Text>Email: {data.location?.email}</Text>
                  <Text>Website: https://jimenezproduce.com/</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Text
                style={[
                  styles.docTitle,
                  { fontSize: 12, textTransform: "uppercase" },
                ]}
              >
                Packing Slip
              </Text>
              <View
                style={[
                  styles.table,
                  { marginTop: 15, width: "80%", marginLeft: "auto" },
                ]}
              >
                <View style={[styles.tableRow]}>
                  <Text
                    style={[
                      styles.tableCell,
                      { backgroundColor: "#eee", textAlign: "center" },
                    ]}
                  >
                    Invoice #:
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { backgroundColor: "#eee", textAlign: "center" },
                    ]}
                  >
                    Invoice Date:
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { textAlign: "center" }]}>
                    {data.id}
                  </Text>
                  <Text style={[styles.tableCell, { textAlign: "center" }]}>
                    {format(new Date(data.createdAt!), "MMMM dd, yyyy")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.row, { alignItems: "flex-start" }]}>
            {/* SHIP TO  */}
            <View style={[styles.table, { marginTop: 15, width: "30%" }]}>
              <View style={[styles.tableRow, { backgroundColor: "#eee" }]}>
                <Text style={styles.tableCell}>Ship To.</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell]}>
                  <Text>{data.receiverName}</Text>
                  <Text>{data.shippingAddress?.street}</Text>
                  <Text>
                    {data.shippingAddress?.city} {data.shippingAddress?.state}
                    {data.shippingAddress?.zip}
                  </Text>
                  <Text>{data.receiverPhone}</Text>
                </View>
              </View>
            </View>

            {/* ORDER SUMMARY TABLE (P.O., Driver, etc) */}
            <View
              style={[
                styles.table,
                {
                  marginTop: 15,
                  width: "32%",
                  height: "auto",
                  marginLeft: "auto",
                },
              ]}
            >
              <View style={[styles.tableRow, { backgroundColor: "#eee" }]}>
                <Text style={styles.tableCell}>P.O. No.</Text>
                <Text style={styles.tableCell}>Ship Date</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{data.po || ""}</Text>
                <Text style={styles.tableCell}>{data.deliveryDate || ""}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* LINE ITEMS TABLE */}
        <View style={[styles.table, { marginTop: 20 }]}>
          <View
            style={[styles.tableRow, { backgroundColor: "#eee" }]}
            wrap={false}
            fixed
          >
            <View style={{ width: "15%" }}>
              <Text style={styles.tableColHeader}>Item Code</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text style={styles.tableColHeader}>Quantity</Text>
            </View>
            <View style={{ width: "70%" }}>
              <Text style={styles.tableColHeader}>Description</Text>
            </View>
          </View>

          {data.lineItems?.map((item, index) => (
            <View
              key={index}
              wrap={false}
              style={[
                styles.tableRow,
                index % 2 !== 0 ? { backgroundColor: "#EEEEEE" } : {},
              ]}
            >
              <View style={[styles.tableCell, { width: "15%" }]}>
                <Text>{item.identifier}</Text>
              </View>
              <View
                style={[styles.tableCell, { width: "15%", textAlign: "right" }]}
              >
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCell, { width: "70%" }]}>
                <Text>{item.title}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* other charges */}
        <View
          style={[
            styles.table,
            {
              marginTop: 15,
              width: "32%",
              height: "auto",
              marginLeft: "auto",
            },
          ]}
        >
          <View style={[styles.tableRow]}>
            <Text style={[styles.tableCell, { backgroundColor: "#eee" }]}>
              Item Count
            </Text>
            <Text style={[styles.tableCell, { textAlign: "right" }]}>
              {data.lineItemCount}
            </Text>
          </View>
          <View style={[styles.tableRow]}>
            <Text style={[styles.tableCell, { backgroundColor: "#eee" }]}>
              Quantity
            </Text>
            <Text style={[styles.tableCell, { textAlign: "right" }]}>
              {data.lineItemQuantity}
            </Text>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
