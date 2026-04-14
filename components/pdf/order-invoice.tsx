import { format } from "date-fns";
import { COLORS, styles } from "./styles"; // Assuming styles contains table formatting
import { OrderSelectType, LineItemSelectType } from "@/lib/db/schema";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

interface OrderInvoiceProps {
  data: OrderSelectType & {
    lineItems: LineItemSelectType[];
    driver?: { name: string };
  };
}

export const OrderInvoice = ({ data }: OrderInvoiceProps) => {
  return (
    <Document title={`Invoice - ${data.id}`}>
      <Page size="A4" style={[styles.page]}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              src={process.env.BETTER_AUTH_URL + "/logo.png"}
              style={styles.logo}
            />
            <View>
              <Text
                style={(styles.docTitle, { fontSize: 20, lineHeight: 1.25 })}
              >
                Jimenez Produce LLC
              </Text>
              <View style={styles.headerContactText}>
                <Text>23141 Rubens Ln</Text>
                <Text>Robertsdale, AL 36567</Text>
                <Text>251-262-2607</Text>
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
                styles.row,
                { border: "1px solid red", marginTop: 20, gap: 0 },
              ]}
            >
              <View
                style={{
                  width: "50%",
                  borderRight: "1px solid red",
                  textAlign: "left",
                }}
              >
                <Text
                  style={[
                    styles.label,
                    { borderBottom: "1px solid red", padding: 8 },
                  ]}
                >
                  Invoice #:
                </Text>
                <Text style={[styles.value, { padding: 8 }]}>{data.id}</Text>
              </View>
              <View
                style={{
                  width: "50%",
                  textAlign: "left",
                }}
              >
                <Text
                  style={[
                    styles.label,
                    { borderBottom: "1px solid red", padding: 8 },
                  ]}
                >
                  Invoice Date:
                </Text>
                <Text style={[styles.value, { padding: 8 }]}>{data.id}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SHIP TO SECTION */}
        <View style={[styles.row]}>
          <View style={{ width: "33.33%" }}>
            <Text
              style={[
                styles.label,
                { padding: 4, lineHeight: 1, borderBottom: "1px solid red" },
              ]}
            >
              Ship To
            </Text>
          </View>

          <View>
            <Text style={styles.value}>{data.receiverName}</Text>
            <Text style={styles.value}>{data.shippingAddress?.street}</Text>
            <Text style={styles.value}>
              {data.shippingAddress?.city}, {data.shippingAddress?.state}{" "}
              {data.shippingAddress?.zip}
            </Text>
            <Text style={styles.value}>{data.receiverPhone}</Text>
          </View>
          <View style={{ width: "33%" }}>
            <Text
              style={[
                styles.label,
                { padding: 4, borderBottom: "1px solid red" },
              ]}
            >
              Ship To
            </Text>
            <View>
              <Text style={styles.value}>{data.receiverName}</Text>
              <Text style={styles.value}>{data.shippingAddress?.street}</Text>
              <Text style={styles.value}>
                {data.shippingAddress?.city}, {data.shippingAddress?.state}{" "}
                {data.shippingAddress?.zip}
              </Text>
              <Text style={styles.value}>{data.receiverPhone}</Text>
            </View>
          </View>
        </View>

        {/* ORDER SUMMARY TABLE (P.O., Driver, etc) */}
        <View style={[styles.table, { marginTop: 15 }]}>
          <View style={[styles.tableRow, { backgroundColor: "#eee" }]}>
            <Text style={styles.tableCell}>P.O. No.</Text>
            <Text style={styles.tableCell}>Ship Date</Text>
            <Text style={styles.tableCell}>Driver</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{data.po || ""}</Text>
            <Text style={styles.tableCell}>{data.deliveryDate || ""}</Text>
            <Text style={styles.tableCell}>{data.driverId || "Tony"}</Text>
            <Text style={styles.tableCell}>{data.status}</Text>
          </View>
        </View>

        {/* LINE ITEMS TABLE */}
        <View style={[styles.table, { marginTop: 20, flexGrow: 1 }]}>
          <View style={[styles.tableRow, { backgroundColor: "#eee" }]}>
            <View style={{ width: "15%" }}>
              <Text style={styles.tableColHeader}>Quantity</Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={styles.tableColHeader}>Item Code</Text>
            </View>
            <View style={{ width: "60%" }}>
              <Text style={styles.tableColHeader}>Description</Text>
            </View>
          </View>

          {data.lineItems?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ width: "15%" }}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={{ width: "25%" }}>
                <Text style={styles.tableCell}>{item.identifier}</Text>
              </View>
              <View style={{ width: "60%" }}>
                <Text style={styles.tableCell}>
                  {item.title} {item.pack ? `(${item.pack})` : ""}
                </Text>
              </View>
            </View>
          ))}

          {/* Fuel Charge Row */}
          <View style={styles.tableRow}>
            <View style={{ width: "15%" }}>
              <Text style={styles.tableCell}></Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text style={styles.tableCell}>FC</Text>
            </View>
            <View style={{ width: "60%" }}>
              <Text style={styles.tableCell}>Fuel Charge</Text>
            </View>
          </View>
        </View>

        {/* TOTALS FOOTER */}
        <View style={{ marginTop: 20, borderTop: 1, paddingTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <View style={{ width: 150 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>${data.subtotal}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>${data.total}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
