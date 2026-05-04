import {
  OrderSelectType,
  LineItemSelectType,
  OrganizationSelectType,
} from "@/lib/db/schema";
import { format } from "date-fns";
import { styles } from "./styles";
import { formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

interface OrderInvoiceProps {
  data: OrderSelectType & {
    lineItems: LineItemSelectType[];
    organization: OrganizationSelectType;
  };
}

export const OrderInvoice = ({ data }: OrderInvoiceProps) => {
  const metadata = data.organization.metadata
    ? JSON.parse(data.organization.metadata)
    : {};

  return (
    <Document title={`Invoice - ${data.id}`}>
      <Page size="A4" style={[{ padding: 10 }]}>
        <View style={[{ borderWidth: 1 }]}>
          <View style={[styles.header, { marginBottom: 20 }]}>
            <View style={styles.headerLeft}>
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={[styles.logo, { marginBottom: 10 }]}
              />
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {data.organization?.name}
              </Text>
              <View style={styles.headerContactText}>
                <Text>{metadata?.street || ""}</Text>
                <Text>{`${metadata?.city || ""}, ${metadata?.state || ""} ${metadata?.zip || ""}`}</Text>
                <Text>Phone: {data.organization?.phone}</Text>
                <Text>Email: {data.organization?.email}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <Text
                style={[styles.docTitle, { fontSize: 24, marginBottom: 10 }]}
              >
                INVOICE
              </Text>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 10 }}>
                  Invoice #:{" "}
                  <Text style={{ fontWeight: "bold" }}>{data.id}</Text>
                </Text>
                <Text style={{ fontSize: 10 }}>
                  Date: {format(new Date(data.createdAt!), "MMM dd, yyyy")}
                </Text>
                <Text style={{ fontSize: 10 }}>
                  P.O. Number: {data.po || "N/A"}
                </Text>
                <Text style={{ fontSize: 10 }}>
                  Due Date:{" "}
                  {data.deliveryDate
                    ? format(new Date(data.deliveryDate), "MMM dd, yyyy")
                    : "Upon Receipt"}
                </Text>
              </View>
            </View>
          </View>

          {/* BILLING & SHIPPING SECTION */}
          <View style={{ flexDirection: "row", marginBottom: 30, gap: 40 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Bill To
              </Text>
              {/* <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                {data.receiverName || "Client Name"}
              </Text> */}
              {/* Replace with actual billing address logic if different from shipping */}
              <Text style={{ fontSize: 10 }}>
                {data.shippingAddress?.street}
              </Text>
              <Text
                style={{ fontSize: 10 }}
              >{`${data.shippingAddress?.city}, ${data.shippingAddress?.state} ${data.shippingAddress?.zip}`}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Ship To
              </Text>
              {/* <Text style={{ fontSize: 11 }}>{data.receiverName}</Text> */}
              <Text style={{ fontSize: 10 }}>
                {data.shippingAddress?.street}
              </Text>
              <Text
                style={{ fontSize: 10 }}
              >{`${data.shippingAddress?.city}, ${data.shippingAddress?.state} ${data.shippingAddress?.zip}`}</Text>
              {/* <Text style={{ fontSize: 10 }}>{data.receiverPhone}</Text> */}
            </View>
          </View>

          {/* LINE ITEMS TABLE */}
          <View style={styles.table}>
            <View style={[styles.tableRow]}>
              <View style={{ width: "15%" }}>
                <Text style={styles.tableColHeader}>Item #</Text>
              </View>
              <View style={{ width: "45%" }}>
                <Text style={styles.tableColHeader}>Description</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={[styles.tableColHeader, { textAlign: "center" }]}>
                  Qty
                </Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={[styles.tableColHeader, { textAlign: "right" }]}>
                  Unit Price
                </Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text
                  style={[
                    styles.tableColHeader,
                    { borderRightWidth: 0, textAlign: "right" },
                  ]}
                >
                  Amount
                </Text>
              </View>
            </View>

            {data.lineItems?.map((item, index) => (
              <View key={index} style={[styles.tableRow]}>
                <View style={{ width: "15%" }}>
                  <Text style={styles.tableCell}>{item.identifier}</Text>
                </View>
                <View style={{ width: "45%" }}>
                  <Text style={styles.tableCell}>{item.title}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text style={[styles.tableCell, { textAlign: "center" }]}>
                    {item.quantity}
                  </Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text style={[styles.tableCell, { textAlign: "right" }]}>
                    {formatUSD(item.price ?? 0)}
                  </Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text
                    style={[
                      styles.tableCell,
                      { textAlign: "right", borderRightWidth: 0 },
                    ]}
                  >
                    {formatUSD(item.total ?? 0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* TOTALS SECTION */}
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}
              >
                Notes & Instructions:
              </Text>
              <Text style={{ fontSize: 9, color: "#444" }}>
                Please include the invoice number on your check.
              </Text>
            </View>

            <View style={{ width: "35%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10 }}>Subtotal</Text>
                <Text style={{ fontSize: 10 }}>{formatUSD(data.subtotal)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10 }}>Tax</Text>
                <Text style={{ fontSize: 10 }}>{formatUSD(data.tax)}</Text>
              </View>
              {data.charges && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>{data.charges.type}</Text>
                  <Text style={{ fontSize: 10 }}>
                    {formatUSD(data.charges.amount ?? 0)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 5,
                  borderTopWidth: 1,
                  borderColor: "#000",
                  marginTop: 5,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                  Total Amount
                </Text>
                <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                  {formatUSD(data.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View>
            <Text style={{ fontSize: 9, textAlign: "center", color: "#999" }}>
              Thank you for your business! | {data.organization?.name} |
              https://jimenezproduce.com/
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};
